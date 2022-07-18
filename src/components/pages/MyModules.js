import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api/apiRequest";

import ModuleList from "../ui/entities/module/ModuleList";
import ButtonBar from "../ui/button/ButtonBar";
import ButtonShowAll from "../ui/button/ButtonShowAll";
import ButtonShowFavorites from "../ui/button/ButtonShowFavorites";
import ButtonAdd from "../ui/button/ButtonAdd";
import ButtonNo from "../ui/button/ButtonNo";
import ButtonYes from "../ui/button/ButtonYes";
import ToolTip from '../ui/tooltip/ToolTip';
import Modal from "../ui/modal/Modal";
import ModuleForm from "../ui/entities/module/ModuleForm";

import './MyModules.scss';

function MyModules() {
    // Properties ----------------------------------
    const API_URL = 'https://my.api.mockaroo.com/';
    const API_KEY = '?key=bb6adbc0';
    const navigate = useNavigate();
    var modalNumber = 0;

    // Hooks ---------------------------------------
    const [loadingMessage, setLoadingMessage] = useState("Loading Modules...");
    const [modules, setModules] = useState(null);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalTitle, setModalTitle] = useState(undefined);
    const [modalDescription, setModalDescription] = useState(undefined);
    const [modalButtons, setModalButtons] = useState([]);

    // Context -------------------------------------
    useEffect(() => { fetchModules() }, []);

    // Methods -------------------------------------
    const fetchModules = async () => {
        const outcome = await apiRequest(API_URL, 'Modules', API_KEY);
        if (outcome.success) setModules (outcome.response);
        else setLoadingMessage(`Error ${outcome.response.status}: Modules could not be found.`);
    }

    const handleShowAll = () => {
        setModules(null);
        fetchModules();
    }

    const handleShowFavorites = () => setModules(modules.filter((module) => module.isFavorite));

    const onSubmit = (newModule) => {
        newModule.ModuleID = modules.length+1;
        setModules([...modules, newModule]);
        handleCancel();
    }

    const onEdit = (editModule) => {
        const editModuleID = modules.findIndex(module => module.ModuleID === editModule.ModuleID);
        setModules(modules.map((module, index) => index === editModuleID ? editModule : module));
        handleCancel();
    }

    const handleAdd = () => {
        initialiseAddModal();
        setModalVisibility(true);
    }

    const handleFavorite = moduleId => setModules(
        modules.map((module) => (
            module.ModuleID === moduleId ? { ...module, isFavorite: true } : module
        ))
    );

    const handleUnfavorite = moduleId => setModules(
        modules.map((module) => (
            module.ModuleID === moduleId ? { ...module, isFavorite: false } : module
        ))
    );

    const handleDelete = id => {
        setModules(modules.filter((module) => module.ModuleID !== id));
        handleCancel();
    };

    const handleDeleteRequest = id => {
        initialiseDeleteModal(id);
        setModalVisibility(true);
    };

    const handleEdit = (editModule) => {
        initialiseEditModal(editModule);
        setModalVisibility(true);
    }

    const handleCancel = () => setModalVisibility(false);

    const createModal = (title, description, buttons) => {
        setModalTitle(title);
        setModalDescription(description);
        setModalButtons(buttons);
        modalNumber++;
    };
    
    const initialiseDeleteModal = id => {
        const selectedModule = modules.find((module) => module.ModuleID === id);
        createModal(
            'Confirm Module Deletion', 
            `Do you want to delete module '${selectedModule.ModuleCode} (${selectedModule.ModuleName})'?`,
            [
                <ToolTip text='Click to delete module'>
                    <ButtonYes hasTitle onClick={() => handleDelete(id)} />
                </ToolTip>,
                <ToolTip text='Click to retain module'>
                    <ButtonNo hasTitle onClick={handleCancel} />
                </ToolTip>
            ]
        );
    };

    const initialiseAddModal = () => {
        createModal(
            'Add New Module',
            <ModuleForm onCancel={handleCancel} onSubmit={onSubmit} />,
            []
        );
    };

    const initialiseEditModal = (editModule) => {
        createModal(
            'Edit Module',
            <ModuleForm onCancel={handleCancel} onSubmit={onEdit} existingModule={editModule}/>,
            []
        );
    };

    const handleModuleClick = (moduleId) => navigate('/students');
    
    // View ----------------------------------------
    return (
        <>
            <h1>My Modules</h1>
            <div className='modulebuttons'>
                <ButtonBar className='pagebar'>
                    <ToolTip text='Show all modules'>
                        <ButtonShowAll hasTitle onClick={handleShowAll} />
                    </ToolTip>
                    <ToolTip text='Show favourite modules'>
                        <ButtonShowFavorites hasTitle onClick={handleShowFavorites} />
                    </ToolTip>
                    <ToolTip text='Add module'>
                        <ButtonAdd hasTitle item='Module' onClick={handleAdd} />
                    </ToolTip>
                </ButtonBar>
            </div>
            {
                !modules
                ? <p>{loadingMessage}</p>
                : modules.length === 0 
                    ? <p>No modules found</p>
                    : <ModuleList 
                        modules={modules}
                        handlers={{ handleFavorite, handleUnfavorite, handleEdit, handleDelete: handleDeleteRequest, handleModuleClick }}
                      />
            }
            {
                modalVisibility &&
                    <Modal key={`${modalTitle}${modalNumber}`} title={modalTitle} buttons={modalButtons}>
                        {modalDescription}
                    </Modal>
            }
        </>
    );
}

export default MyModules;