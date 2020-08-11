# Facemesh

Tensorflow Facemesh model is a lightweight machine learning pipeline predicting 486 3D facial landmarks to infer the approximate surface geometry of a human face ([paper](https://arxiv.org/pdf/1907.06724.pdf)).


More background information about the model, as well as its performance characteristics on different datasets, can be found here: [https://drive.google.com/file/d/1VFC_wIpw4O7xBOiTgUldl79d9LA-LsnA/view](https://drive.google.com/file/d/1VFC_wIpw4O7xBOiTgUldl79d9LA-LsnA/view)


## Installation

You need to install yarn to build the app.
Intall the app using the shell command FaceFlowApp.sh:

    $ cd D:/GitHub/FaceflowApp/Tensorflow/facemesh/demo (YourDir)
    $ yarn 
    $ yarn watch


#### Keypoints

Here is map of the keypoints:

<img src="mesh_map.jpg" alt="keypoints_map" style="width: 500px; height: 500px">

The UV coordinates for these keypoints are available via the `getUVCoords()` method on the `FaceMesh` model object. They can also be found in `src/uv_coords.ts`.
