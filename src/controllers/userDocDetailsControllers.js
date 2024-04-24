const { IMAGE_BASE_URL } = require("../../config.js");
const idDocument = require("../models/idDocument.js");
const studyDocuments = require("../models/studyDocuments.js");
const user = require("../models/userModel.js");
const fs = require("fs");
const path = require("path");

// exports.setIdDocuments = async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const { pancardId, aadharcardId, photoId, signatureId, leftThumbId } =
//       req.query;
//     const { pancard, aadharcard, photo, signature, leftThumb } = req?.files;

//     const pancardURL = `${IMAGE_BASE_URL}${pancard[0].filename}`;
//     const aadharcardURL = `${IMAGE_BASE_URL}${aadharcard[0].filename}`;
//     const signatureURL = `${IMAGE_BASE_URL}${signature[0].filename}`;
//     const photoURL = `${IMAGE_BASE_URL}${photo[0].filename}`;
//     const leftThumbURL = `${IMAGE_BASE_URL}${leftThumb[0].filename}`;

//     const updateDocument = async (documentId, type, url, filename) => {
//       if (documentId) {
//         const oldDocument = await idDocument.findById(documentId);
//         if (oldDocument) {
//           const __dirname = path.resolve();
//           const filePath = path.join(
//             __dirname,
//             "src/uploads",
//             oldDocument.filename
//           );
//           fs.unlinkSync(filePath);
//         }
//         return await idDocument.findByIdAndUpdate(documentId, {
//           type,
//           url,
//           filename,
//         });
//       } else {
//         return new idDocument({ type, url, filename });
//       }
//     };

//     const AadharcardDocument = await updateDocument(
//       aadharcardId,
//       "aadharcard",
//       aadharcardURL,
//       aadharcard[0]?.filename
//     );
//     const PancardDocument = await updateDocument(
//       pancardId,
//       "pancard",
//       pancardURL,
//       pancard[0]?.filename
//     );
//     const PhotoDocument = await updateDocument(
//       photoId,
//       "photo",
//       photoURL,
//       photo[0]?.filename
//     );
//     const SignatureDocument = await updateDocument(
//       signatureId,
//       "signature",
//       signatureURL,
//       signature[0]?.filename
//     );
//     const LeftThumbDocument = await updateDocument(
//       leftThumbId,
//       "leftThumb",
//       leftThumbURL,
//       leftThumb[0]?.filename
//     );

//     await Promise.all([
//       PancardDocument.save(),
//       AadharcardDocument.save(),
//       SignatureDocument.save(),
//       PhotoDocument.save(),
//       LeftThumbDocument.save(),
//     ]);

//     const userInstance = await user.findOne({ _id: userId });

//     // userInstance.idDocument = userInstance.idDocument.filter((doc) => {
//     //   return ![pancardId, aadharcardId, photoId, signatureId, leftThumbId].some(
//     //     (id) => id === String(doc)
//     //   );
//     // });
//     userInstance.idDocument = userInstance.idDocument.filter((doc) => {
//       return ![
//         pancardId,
//         aadharcardId,
//         photoId,
//         signatureId,
//         leftThumbId,
//       ].includes(String(doc));
//     });
//     userInstance?.idDocument?.push(
//       PancardDocument._id,
//       AadharcardDocument._id,
//       SignatureDocument._id,
//       PhotoDocument._id,
//       LeftThumbDocument._id
//     );
//     await userInstance.save();

//     res.status(200).json({
//       success: true,
//       message: "Documents uploaded successfully",
//       urls: {
//         pancard: pancardURL,
//         aadharcard: aadharcardURL,
//         signature: signatureURL,
//         photo: photoURL,
//         leftThumb: leftThumbURL,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error uploading documents",
//     });
//   }
// };

exports.getIdDocuments = async (req, res) => {
  try {
    const userId = req.query.userId;
    const IdDocuments = await user
      .findOne({ _id: userId })
      .populate("idDocument");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Id Documents list ",
      urls: IdDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error to get id documents",
    });
  }
};

exports.setStudyDocument = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.query.userId;
    const documentId = req.query.documentId;
    const { filename } = req.file;
    const imageURL = `${IMAGE_BASE_URL}${filename}`;

    const updateDocument = async (docId, type, url, filename) => {
      if (docId) {
        const oldDocument = await studyDocuments.findById(docId);
        if (oldDocument) {
          const __dirname = path.resolve();
          const filePath = path.join(
            __dirname,
            "src/uploads",
            oldDocument.filename
          );
          fs.unlinkSync(filePath);
        }
        return await studyDocuments.findByIdAndUpdate(docId, {
          type,
          url,
          filename,
        });
      } else {
        return new studyDocuments({ type, url, filename });
      }
    };

    const StudyDocuments = await updateDocument(
      documentId,
      type,
      imageURL,
      filename
    );
    StudyDocuments.save();

    const userInstance = await user.findOne({ _id: userId });

    // userInstance.studyDocuments = userInstance.studyDocuments.filter((doc) => {
    //   return ![documentId].some((id) => id === String(doc));
    // });
    userInstance.studyDocuments = userInstance.studyDocuments.filter((doc) => {
      return ![documentId].includes(String(doc));
    });
    userInstance?.studyDocuments?.push(StudyDocuments._id);
    await userInstance.save();
    const IdDocuments = await user
      .findOne({ _id: userId })
      .populate("studyDocuments");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Documents uploaded successfully",
      document: {
        url: imageURL,
        id: StudyDocuments._id,
      },
      updatedStudyDocuments: IdDocuments?.studyDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading documents",
    });
  }
};

exports.getStudyDocuments = async (req, res) => {
  try {
    const userId = req.query.userId;
    const IdDocuments = await user
      .findOne({ _id: userId })
      .populate("studyDocuments");
    res.status(200).json({
      success: true,
      status: 200,
      message: "Study Documents list ",
      urls: IdDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error to get study documents",
    });
  }
};

exports.setIdDocuments = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.query.userId;
    const documentId = req.query.documentId;
    const { filename } = req.file;
    const imageURL = `${IMAGE_BASE_URL}${filename}`;

    const updateDocument = async (docId, type, url, filename) => {
      if (docId) {
        const oldDocument = await idDocument.findById(docId);
        if (oldDocument) {
          const __dirname = path.resolve();
          const filePath = path.join(
            __dirname,
            "src/uploads",
            oldDocument.filename
          );
          fs.unlinkSync(filePath);
        }
        return await idDocument.findByIdAndUpdate(docId, {
          type,
          url,
          filename,
        });
      } else {
        return new idDocument({ type, url, filename });
      }
    };

    const IdDocument = await updateDocument(
      documentId,
      type,
      imageURL,
      filename
    );
    IdDocument.save();

    const userInstance = await user.findOne({ _id: userId });

    // userInstance.studyDocuments = userInstance.studyDocuments.filter((doc) => {
    //   return ![documentId].some((id) => id === String(doc));
    // });
    userInstance.idDocument = userInstance.idDocument.filter((doc) => {
      return ![documentId].includes(String(doc));
    });
    userInstance?.idDocument?.push(IdDocument._id);
    await userInstance.save();
    const IdDocuments = await user
      .findOne({ _id: userId })
      .populate("idDocument");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Documents uploaded successfully",
      document: {
        url: imageURL,
        id: IdDocument._id,
      },
      updatedIdDocuments: IdDocuments?.idDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading documents",
    });
  }
};
