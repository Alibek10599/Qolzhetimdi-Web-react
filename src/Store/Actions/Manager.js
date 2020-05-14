import Compressor from "compressorjs";

class Manager {

    static uploadImages(storageRef, childs, images, index, image_urls, completion) {
        if(index === childs.length) {
            completion(image_urls);
        } else {
            new Compressor(images[index], {
                quality: 0.6,
                success(result) {
                    const formData = new FormData();

                    // The third parameter is required for server
                    formData.append('file', result, result.name);

                    storageRef.child(childs[index]).put(images[index]).then(function(snapshot) {
                        storageRef.child(childs[index]).getDownloadURL().then(function(downloadURL) {
                            image_urls[childs[index]] = downloadURL;
                            Manager.uploadImages(storageRef, childs, images, index + 1, image_urls, completion);
                        }).catch(error => {
                            completion(image_urls);
                        })
                    }).catch(err => {
                        completion(image_urls);
                    })
                },
                error(err) {
                    completion(image_urls);
                    console.log(err.message);
                },
            });
        }
    }
}

export default Manager;
