import firebase from "../../Config/fbConfig";


export const signInWithPhoneNumber = ({phoneNumber, appVerifier}, completion) => {
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier).then(function (confirmationResult) {
        completion(confirmationResult);
    }).catch(function (error) {
        console.log(error);
        completion(null);
    });
};

export const verifyCode = ({confirmationResult, code}, completion) => {
    confirmationResult.confirm(code).then(function (result) {
        completion(result.user);
    }).catch(function (error) {
        completion(null);
    });
};
