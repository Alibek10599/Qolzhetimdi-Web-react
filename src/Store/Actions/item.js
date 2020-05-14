import firebase from "../../Config/fbConfig";

export const createItem = (item, completion) => {
    firebase.firestore().collection("items").add(item).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};

export const updateItem = (id, item, completion) => {
    firebase.firestore().collection("items").doc(id).update(item).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};

export const createShopItem = (id, item, completion) => {
    firebase.firestore().collection("shops").doc(id).collection("items").add(item).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};

export const updateShopItem = (id, itemId, item, completion) => {
    firebase.firestore().collection("shops").doc(id).collection("items").doc(itemId).update(item).then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};

export const deleteShopItem = (id, itemId, completion) => {
    firebase.firestore().collection("shops").doc(id).collection("items").doc(itemId).delete().then(res => {
        completion(res);
    }).catch(function (error) {
        completion(null);
    });
};
