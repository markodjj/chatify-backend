import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSiderbar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSlidebar: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async (req, res) => {
    
    try {
        const { id:userToChatId } = req.query;
        const { last:last } = req.query;
        const numberOfMessages = parseInt(last, 10);
        const myId = req.user._id;
        console.log(numberOfMessages);
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId:userToChatId},
                {senderId: userToChatId, receiverId:myId},
            ]
        })
        .sort({ createdAt: -1 })
        .limit(numberOfMessages);
        
        
        const sortedMessages = messages.reverse();
        setTimeout(() => {
          res.status(200).json(sortedMessages);
        }, 0);
        
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

// export const getMessages = async (req, res) => {
//     try {
//         const { userId:userToChatId, last} = req.query;
//         const numberOfMessages = parseInt(last, 10);
//         const myId = req.user._id;
       
//         const messages = await Message.find({
//             $or:[
//                 {senderId: myId, receiverId:userToChatId},
//                 {senderId: userToChatId, receiverId:myId},
//             ]
//         })
//         .sort({ createdAt: -1 }) 
//         .limit(numberOfMessages);

//         const sortedMessages = messages.reverse();
//         res.status(200).json(sortedMessages);
//     } catch (error) {
//         console.log("Error in getMessages controller: ", error.message);
//         res.status(500).json({error: "Internal server error"});
//     }
// };


//   pagination
// export const getMessages = async (req, res) => {
    
//     try {
//         const { id:userToChatId, page:pageFromReq, limit:limitFromReq } = req.query;

//         const page = parseInt(pageFromReq, 10) || 0;
//         const limit = parseInt(limitFromReq, 10) || 10;
      
//         const myId = req.user._id;
//         console.log(req.query);
      
//       console.log(userToChatId, myId, page, limit)
//       // Fetch total message count for pagination
//       const totalMessages = await Message.countDocuments({
//         $or: [
//           { senderId: myId, receiverId: userToChatId },
//           { senderId: userToChatId, receiverId: myId },
//         ],
//       });
  
//       // Fetch paginated messages (newest first)
//       const messages = await Message.find({
//         $or: [
//           { senderId: myId, receiverId: userToChatId },
//           { senderId: userToChatId, receiverId: myId },
//         ],
//       })
//         .sort({ createdAt: -1 }) // Sort newest first
//         .skip(page) // Offset pagination
//         .limit(limit);
  
//       const nextPage = page + limit < totalMessages ? page + limit : null;
//       setTimeout(() => {
//         res.status(200).json({
//           data: messages.reverse(), // Reverse so older messages show at the top
//           currentPage: page,
//           nextPage,
//         });
//       }, 10);
      
  
//     } catch (error) {
//       console.error("Error fetching messages:", error.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };
  



export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // this is for image
        }

        const newMessage = new Message ({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

    

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error: "Internal serer error"});
    }
}