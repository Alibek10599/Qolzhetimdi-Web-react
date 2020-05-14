import firebase from "../../Config/fbConfig";
import Manager from "./Manager";


export const createShop = (shop, files, completion) => {
    firebase.firestore().collection("shops").add(shop).then(res => {
        Manager.uploadImages(firebase.storage().ref("shops").child(res.id), ["logo", "background"], files, 0, {}, refs => {
            firebase.firestore().collection("shops").doc(res.id).update({ logo: refs.logo, background: refs.background}).then(result => {
                completion(result);
            }).catch(function (error) {
                completion(null);
            });
        })
    }).catch(function (error) {
        completion(null);
    });
};

export const updateWorkingHours = (id, hours, completion) => {
    firebase.firestore().collection("shops").doc(id).update({ working_hours: hours}).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};

export const updateImage = (id, type, file, completion) => {
    firebase.storage().ref("shops").child(id).child(type).put(file).then(res => {
        firebase.storage().ref("shops").child(id).child(type).getDownloadURL().then(url => {
            firebase.firestore().collection("shops").doc(id).update({ [type]: url}).then(res => {
                completion(res);
            }).catch(function (error) {
                completion(null);
            });
        });
    });
};


export const createReply = (id, reviewId, reply, completion) => {
    firebase.firestore().collection("shops").doc(id).collection("reviews").doc(reviewId).update({ reply: {
            body: reply,
            date: new Date()
    }}).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};
