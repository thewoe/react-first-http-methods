import { useState, useEffect } from "react";
import { apiRequest } from "../api/apiRequest";

import UserList from "../ui/entities/user/UserList";
import ButtonBar from "../ui/button/ButtonBar";
import ButtonShowAll from "../ui/button/ButtonShowAll";
import ButtonStaff from "../ui/button/ButtonStaff";
import ButtonUsers from "../ui/button/ButtonUsers";
import ButtonAdd from "../ui/button/ButtonAdd";
import ButtonNo from "../ui/button/ButtonNo";
import ButtonYes from "../ui/button/ButtonYes";
import ToolTip from '../ui/tooltip/ToolTip';
import Modal from "../ui/modal/Modal";
import UserForm from "../ui/entities/user/UserForm";

import './Students.scss';

function Students() {
    // Properties ----------------------------------
    const API_URL = 'https://my.api.mockaroo.com/';
    const API_KEY = '?key=bb6adbc0';
    var modalNumber = 0;

    // Hooks ---------------------------------------
    const [loadingMessage, setLoadingMessage] = useState("Loading Users...");
    const [users, setUsers] = useState(null);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalTitle, setModalTitle] = useState(undefined);
    const [modalDescription, setModalDescription] = useState(undefined);
    const [modalButtons, setModalButtons] = useState([]);

    // Context -------------------------------------
    useEffect(() => { fetchUsers() }, []);

    // Methods -------------------------------------
    const fetchUsers = async () => {
        const outcome = await apiRequest(API_URL, 'Users', API_KEY);
        if (outcome.success) {
            setUsers (outcome.response);
            return outcome.response;
        }
        else setLoadingMessage(`Error ${outcome.response.status}: Users could not be found.`);
    }

    const onSubmit = (newUser) => {
        newUser.UserID = users.length+1;
        setUsers([...users, newUser]);
        handleCancel();
    }

    const onEdit = (editUser) => {
        const editUserID = users.findIndex(user => user.UserID === editUser.UserID);
        setUsers(users.map((user, index) => index === editUserID ? editUser : user));
        handleCancel();
    }

    const handleAdd = () => {
        initialiseAddModal();
        setModalVisibility(true);
    }

    const handleDelete = id => {
        setUsers(users.filter((user) => user.UserID !== id));
        handleCancel();
    };

    const handleDeleteRequest = id => {
        initialiseDeleteModal(id);
        setModalVisibility(true);
    };

    const handleEdit = (editUser) => {
        initialiseEditModal(editUser);
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
        const selectedUser = users.find((user) => user.UserID === id);
        createModal(
            'Confirm User Deletion', 
            `Do you want to delete user '${selectedUser.UserFirstname} ${selectedUser.UserLastname}'?`,
            [
                <ToolTip text='Click to delete user'>
                    <ButtonYes hasTitle onClick={() => handleDelete(id)} />
                </ToolTip>,
                <ToolTip text='Click to retain user'>
                    <ButtonNo hasTitle onClick={handleCancel} />
                </ToolTip>
            ]
        );
    };

    const initialiseAddModal = () => {
        createModal(
            'Add New User',
            <UserForm onCancel={handleCancel} onSubmit={onSubmit} />,
            []
        );
    };

    const initialiseEditModal = (editUser) => {
        createModal(
            'Edit User',
            <UserForm onCancel={handleCancel} onSubmit={onEdit} existingUser={editUser}/>,
            []
        );
    };

    const handleShowAll = () => {
        setUsers(null);
        fetchUsers();
    }

    const handleShowStaff = async () => {
        setUsers(null);
        const allUsers = await fetchUsers();
        setUsers(allUsers.filter((user) => user.UserUsertypeID !== 2));
    }

    const handleShowStudents = async () => {
        setUsers(null);
        const allUsers = await fetchUsers();
        setUsers(allUsers.filter((user) => user.UserUsertypeID === 2));
    }
    
    // View ----------------------------------------
    return (
        <>
            <h1>Enrolled Users</h1>
            <div className='modulebuttons'>
                <ButtonBar className='pagebar'>
                    <ToolTip text='Show all users'>
                        <ButtonShowAll hasTitle onClick={handleShowAll} />
                    </ToolTip>
                    <ToolTip text='Show only staff'>
                        <ButtonStaff hasTitle onClick={handleShowStaff} />
                    </ToolTip>
                    <ToolTip text='Show only students'>
                        <ButtonUsers hasTitle item='Show Students' onClick={handleShowStudents} />
                    </ToolTip>
                    <ToolTip text='Add module'>
                        <ButtonAdd hasTitle item='User' onClick={handleAdd} />
                    </ToolTip>
                </ButtonBar>
            </div>
            {
                !users
                ? <p>{loadingMessage}</p>
                : users.length === 0
                    ? <p>No users found</p>
                    : <UserList 
                        users={users}
                        handlers={{ handleEdit, handleDelete: handleDeleteRequest }}
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

export default Students;