import { useState } from "react";

import Form from "../../form/Form";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";

import '../../form/FormInput.scss';

function UserForm({ onSubmit, onCancel, existingUser=null }) {
    // Properties ----------------------------------
    if (!existingUser) {
        existingUser = {
          UserFirstname: "",
          UserLastname: "",
          UserEmail: "",
          UserPassword: "",
          UserRegistered: false,
          UserUsertypeID: 0,
          UserLevel: 0,
          UserImageURL: ""
        }
    }

    // Hooks ---------------------------------------
    const [userForm, setUserForm] = useState(existingUser);
    const [errors, setErrors] = useState(Object.keys(existingUser).reduce((accum, key) => ({ ...accum, [key]: null }), {}));
    const [noFormInput, setNoFormInput] = useState(false);

    // Context -------------------------------------

    // Methods -------------------------------------

    const handleSubmit = (event) => {
        event.preventDefault();
        userForm.UserUsertypeID = parseInt(userForm.UserUsertypeID);
        userForm.UserLevel = parseInt(userForm.UserLevel);

        if (userForm.UserFirstname !== "" || userForm.UserLastname !== "" || userForm.UserEmail !== "" || userForm.UserUsertypeID !== 0 || userForm.UserLevel !== 0 || userForm.UserImageURL !== "") {
            setNoFormInput(false);
            const userFirstnameErrors = validateUserFirstname();
            const userLastnameErrors = validateUserLastname();
            const userEmailErrors = validateUserEmail();
            const userImageErrors = validateUserImage();

            setErrors({
                UserFirstname: userFirstnameErrors,
                UserLastname: userLastnameErrors,
                UserEmail: userEmailErrors,
                UserImageURL: userImageErrors
            });

            if (!userFirstnameErrors && !userLastnameErrors && !userEmailErrors && !userImageErrors) {
                onSubmit(userForm);
            }
        }
        else {
            setNoFormInput(true);
        }
    }

    const handleChange = (event) => {
        setNoFormInput(false);
        setUserForm({ ...userForm, [event.target.name]: event.target.value });
    }

    const handleKeyUp = (event) => {
        realtimeValidator(event);
    }

    const realtimeValidator = (event) => {
        switch (event.target.name) {
            case 'UserFirstname':
                var userFirstnameValidation = validateUserFirstname();
                break;
            case 'UserLastname':
                var userLastnameValidation = validateUserLastname();
                break;
            case 'UserEmail':
                var userEmailValidation = validateUserEmail();
                break;
            case 'UserImageURL':
                var userImageURLValidation = validateUserImage();
                break;
            default:
                break;
        }
        
        setErrors({
            UserFirstname: userFirstnameValidation,
            UserLastname: userLastnameValidation,
            UserEmail: userEmailValidation,
            UserImageURL: userImageURLValidation
        });
    }

    const validateUserFirstnameLength = () => userForm.UserFirstname.length < 2 && "First name must be more than 1 character. ";

    const validateUserFirstname = () => {
        return validateUserFirstnameLength();
    }

    const validateUserLastnameLength = () => userForm.UserFirstname.length < 3 && "Last name must be more than 2 characters. ";

    const validateUserLastname = () => {
        return validateUserLastnameLength();
    }

    const validateUserEmailFormat = () => !(/^([\w.-]+)@([\w-]+)((\.(\w){2,3})+)$/.test(userForm.UserEmail)) && "User email must be in a valid email format. ";

    const validateUserEmail = () => {
        return validateUserEmailFormat();
    }

    const validateUserImageFormat = () => !(/^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=/?]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$\-_.+!*'(),;:@&=/?]|%[0-9a-fA-F]{2})*)?)?$/.test(userForm.UserImageURL)) && "User image must be in a valid URL format. ";
    
    const validateUserImage = () => {
        return validateUserImageFormat();
    }

    // View ----------------------------------------
    return (
        <>
            <Form onSubmit={handleSubmit} onCancel={onCancel}>
                {
                    noFormInput && <p className='errormessage'>Please complete the form before submitting.</p>
                }
                <FormInput 
                    type='text'
                    id='userfirstname'
                    name='UserFirstname'
                    label='First Name'
                    description='Enter the first name of the user'
                    errormessage={errors.UserFirstname}
                    placeholder='Johnny'
                    value={userForm.UserFirstname}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
                <FormInput 
                    type='text'
                    id='userlastname'
                    name='UserLastname'
                    label='Last Name'
                    description='Enter the last name of the user'
                    errormessage={errors.UserLastname}
                    placeholder='Appleseed'
                    value={userForm.UserLastname}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
                <FormInput 
                    type='text'
                    id='useremail'
                    name='UserEmail'
                    label='Email Address'
                    description='Enter the email address of the user'
                    errormessage={errors.UserEmail}
                    placeholder='johnny.appleseed@icloud.com'
                    value={userForm.UserEmail}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
                <FormSelect
                    id='usertype'
                    name='UserUsertypeID'
                    label='User Type'
                    description='Enter the role of the user'
                    errormessage={errors.UserUsertypeID}
                    selectoptions = {[
                        {value: 1, displaytext: 'Administrator'},
                        {value: 2, displaytext: 'Module Leader'},
                        {value: 3, displaytext: 'Lecturer'},
                        {value: 4, displaytext: 'Teaching Assistant'},
                        {value: 5, displaytext: 'Student'}
                    ]}
                    value={userForm.UserUsertypeID}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
                <FormSelect
                    id='userlevel'
                    name='UserLevel'
                    label='User Level'
                    description='Enter the level of the user'
                    errormessage={errors.UserLevel}
                    selectoptions = {[
                        {value: 3, displaytext: '3'},
                        {value: 4, displaytext: '4'},
                        {value: 5, displaytext: '5'},
                        {value: 6, displaytext: '6'},
                        {value: 7, displaytext: '7'}
                    ]}
                    value={userForm.UserLevel}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
                <FormInput 
                    type='text'
                    id='userimage'
                    name='UserImageURL'
                    label='User Image'
                    description='Enter the image url of the user'
                    errormessage={errors.UserImageURL}
                    placeholder='https://www.images.com/mypic.jpg'
                    value={userForm.UserImageURL}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
            </Form>
        </>
    );
}

export default UserForm;