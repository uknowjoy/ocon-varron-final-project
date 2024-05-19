// App.js
import React, { useEffect, useState } from 'react';
import "./StudyBuddy.css";
import RegistrationForm from './pages/registration';
import moment from 'moment';
import Modal from './components/Modal/Modal';
import { act } from 'react-dom/test-utils';
const token = localStorage.getItem('token');





const StudyPlanner = ({
  onNavigate,
  onAddActivity,
  onRemoveActivity,
  activities,

}) => {
  
  const [newActivity, setNewActivity] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [activityToRemove, setActivityToRemove] = useState(null);

  // const [showModalActivity, setShowModalActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const selecting = async (activity) => {
    setShowModal(false);
    const foundActivity = activities.find((thisActivity) => thisActivity._id === activity._id);
    setSelectedActivity(foundActivity);
    console.log(foundActivity)

  }

  const addActivity = async () => {

    try {
      if (newActivity.trim() !== "") {
        const response = await fetch('http://localhost:3001/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include any necessary authorization headers
            Authorization: `Bearer ${token}`,
          },
          
          body: JSON.stringify({ newActivity }),
        });
        console.log(token);
        if (!response.ok) {
          throw new Error('Failed to create activity');
        }

        // Optionally, handle success (e.g., navigate to another page)
        onNavigate("ResourceRepository");
        setNewActivity("");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  
  const removeActivity = async (index) => {
    setShowModalDelete(true);
    setActivityToRemove(index);


  };


  const confirmRemoveActivity = async () => {
    try {
      // Make a DELETE request to remove the activity
      const response = await fetch(`http://localhost:3001/api/user/delete/${activityToRemove._id}`, {
        method: 'DELETE',
        headers: {
          // Include any necessary headers (e.g., authorization)
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
      if (!response.ok) {
        throw new Error('Failed to remove activity');
      }

      
    } catch (error) {
      console.error('Error removing activity:', error);
      // Handle error (e.g., display an error message to the user)
    }
    setShowModal(false);
    setActivityToRemove(null);
  };

  const cancelRemoveActivity = () => {
    // Cancel removal and hide the modal
    setShowModalDelete(false);
    setActivityToRemove(null);
  };

 

  // const selActivity = (activityId) =>{
  //   const foundActivity = activities.find((activity) => activity._id === activityId);
  //   setSelectedActivity(foundActivity); // Set the selected activity
  //   setShowModalActivity(true); // Show the modal
  //   setIsTrue(foundActivity?.complete || false);
    
  // }



  const closeModal = () => {
    setShowModal(true);
    setSelectedActivity(null)
  };

  const [isTrue, setIsTrue] = useState(false);

  const handleToggle = () => {
    setSelectedActivity(prevActivity => ({
      ...prevActivity,
      complete: !prevActivity.complete,
    }));
    setIsTrue(!selectedActivity.complete); 
    console.log(isTrue)
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/update/${selectedActivity._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          information: selectedActivity?.information,
          complete: isTrue, // Pass the updated 'isTrue' value
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      
      closeModal(); // Close modal on successful update
      window.location.reload();
    } catch (error) {
      console.error('Error updating activity:', error);
      // Handle error, show message to the user, etc.
    }
  };
  // const [selectedText, setSelectedText] = useState('');


  


  return (
    <div className="content">
    

    {showModal ? (
      <div>
        <h2 className='text-3xl font-bold mb-6'>Study Planner</h2>
        <div className="task-input"> 
        <input
            className='hover:border-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50'
            type="text"
            placeholder="Add a new activity..."
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />  

          <button 
            className='bg-blue-500 hover:bg-red-500 text-white font-bold w-[100px] h-[45px] rounded'
            onClick={addActivity}
          >
            Add
          </button>
          </div>
          <div className='h-[1px] bg-gray-300'> </div>
          <h3 className='text-3xl font-bold mt-3'>Topics</h3>
          <div>
            
            <ul className='activity-list'>
              {activities.map((activity, index) => (
                <li className='pt-3 flex justify-between items-center border rounded-md p-4 mb-4  transition duration-300 ' key={index}>
                  
                  <div className='text-xl flex items-center justify-center'>
                  <span className='inline-block mr-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center'>
                    {index + 1}
                  </span>
                  <span>{activity.activity}</span>
                </div>

                  <button 
                  className='bg-teal-600 hover:bg-teal-800 text-white font-bold w-[100px] h-[45px] rounded'
                  onClick={() => selecting(activity)}
                  >
                  Open
                </button>
                </li>
              ))}
              

             
            </ul>

          </div>
        
      </div>
    ) : (
      <div>

        {showModalDelete ? (<div>

          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md">
              <p className="text-center mb-4">Are you sure you want to delete this activity?</p>
              <div className="flex justify-center space-x-4">
                <button className="px-4 py-2 hover:bg-red-500 text-white rounded-md" onClick={confirmRemoveActivity}>
                  Delete
                </button>
                <button className="px-4 py-2 hover:bg-gray-300 hover:text-gray-800 rounded-md" onClick={() => setShowModalDelete(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>



          
        </div>) : (<div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-3xl font-bold'>Study Planner Topics</div>
            <button onClick={() => removeActivity(selectedActivity)} className="px-4 py-2 hover:bg-red-500 text-white rounded-md">
              Delete
            </button>
          </div>



          <div className='Modal bg-green-50 center rounded'>
            
        <div>
        <button onClick={handleToggle} className='mt-5 ml-10'>
          {selectedActivity.complete ? 'Complete' : 'In Progress'}
        </button>
        
        </div>


        <div className='text-3xl  flex flex-col items-center'>
          
            <h3>
              <span className='font-bold'>{selectedActivity.activity}</span>
            </h3>
            
            {/* TEXT AREA */}
            <div className="w-full max-w-screen-md mt-4 flex justify-center">
              <textarea 
                className='w-full md:w-[90%] h-40 p-2 border rounded-md resize-y text-base hover:border-teal-600 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-opacity-50'
                value={selectedActivity?.information}
                onChange={(e) => {
                  const updatedInfo = e.target.value;
                  setSelectedActivity(prevActivity => ({
                    ...prevActivity,
                    information: updatedInfo,
                  }));
                }}
                placeholder="Add information..."
              ></textarea>
            </div>
            
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button 
              className='bg-teal-600 hover:bg-teal-800 text-white w-[100px] h-[45px] rounded'
              onClick={() => handleSubmit()}
            >
              Save
            </button>
            <button 
              className='bg-teal-600 hover:bg-teal-800 text-white w-[100px] h-[45px] rounded'
              onClick={() => closeModal()}
            >
              Close
            </button>
          </div>
        </div>

        </div>)}

      </div>
    )}
      
    </div>
  );
};

const ResourceRepository = ({ activities, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showComment, setshowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setcommentCount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState();
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);


  const removeActivity = async (index) => {
    setShowModalDelete(true);
    setCommentToDelete(index)
  };


  const clickShowAnswers = async (id) => {
    setshowComment(prevShowComment => !prevShowComment);
    
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const setShowModalNow = (activityId) => {

    
    const foundActivity = activities.find((activity) => activity._id === activityId);
    setSelectedActivity(foundActivity);
    setShowModal(true);
    getAllComments(activityId);
  };

  const getAllComments = async (index) => {
    try{
      const response = await fetch(`http://localhost:3001/api/user/comment/${index}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      setComments(data.comment);
      setcommentCount(data.count);

    } catch (error){
      console.error('Error fetching user comments:', error);
    }
    }

    const handleEditButton = async (comment, commentId, activtyId) => {
      saveEdit(commentId);
      getAllComments(activtyId);
      console.log(getAllComments);
      setIsEditing(false);
    }

    const handleEdit = async (commentId) => {
      setIsEditing(true);
      setEditingCommentId(commentId);
      
      const commentToEdit = comments.find(comment => comment._id === commentId);
      if (commentToEdit) {
        setUpdatedComment(commentToEdit.comment);
      }
      
    }

    const handleDelete = (commentId) => {
      setCommentToDelete(commentId);
      setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user/comment/${commentToDelete}`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        console.log(data)

        getAllComments(selectedActivity._id);
      } catch (error){
        console.log(error);
      }
      setShowModalDelete(false)
    };

    const handleCancelDelete = () => {
      // Close the delete confirmation modal
      setShowDeleteConfirmation(false);
    };


    const saveEdit = async (commentId) =>{
      try {
      const response = await fetch(`http://localhost:3001/api/user/comment/${commentId}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        body: JSON.stringify({comment: updatedComment})
      })
      console.log(response)
    } catch (error){
      console.log(error);
    }
  }


  const [showModalDelete, setShowModalDelete] = useState(false);
  const [newComment, setNewComment] = useState('');


  const handleSubmit = async (comment, id, selected) => {

    const response = await fetch(`http://localhost:3001/api/user/comment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, comment }),
    });
    const data = response.json()
    console.log(data)
    setNewComment('');
    getAllComments(selectedActivity._id);
  };

  return (
    <div className="content">
      
     

      {/* Modal */}
      {showModal ? (
       <div className="p-6 ">
        <div className='flex justify-between'>
          <div className='text-3xl font-bold text-black mb-4'>{selectedActivity?.activity}</div>
          <div>
          <button onClick={closeModal} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'>
            Close
          </button>
          </div>
        </div>
       
       <div className='text-xl text-gray-500'> <span className='font-bold'>Author:</span> {selectedActivity.username.firstname} {selectedActivity.username.lastname} </div>
       <div className='bg-white rounded-lg shadow-md text-xl '>
        <p className='mb-4 mt-6 pt-4'><span className='font-semibold'>Information:</span> {selectedActivity.information}</p>
        <div className=' justify-around grid grid-cols-2 mt-20'>
        <p className='mb-2'>
          <span className='font-semibold'>Status:</span> {selectedActivity.complete ? 'Done' : 'In Progress'}
        </p>
        
        <p className='mb-2'>
          <span className='font-semibold'>Views:</span> {selectedActivity.view} 
        </p>
        
        <p className='mb-2'>
          <span className='font-semibold'>Answered:</span> {commentCount} 
        </p>

        <p className='mb-2'>
          <span className='font-semibold'>Created:</span> {moment(selectedActivity.createdAt).format('MMMM DD, YYYY')}  
        </p>
        
        </div>
        <p className='mb-4 mt-10'>
          <span className='font-semibold'>Answers:  <span className='font-normal text-gray-500 hover:text-blue-700 cursor-pointer' onClick={() => clickShowAnswers(selectedActivity._id)}>   {showComment ? 'Hide Answers...' : 'Reveal Answers...'}</span>  </span>
        </p>
        {showComment ? ( <div>
          
          
          <ul className="max-h-60 overflow-y-auto">
            {comments.map((singleComment, index) => (
              <li key={index} className="bg-gray-100 p-4 mb-5 rounded-md">
                <div className="flex justify-between mb-2">
                  <div className='font-bold'>{singleComment.username.firstname} {singleComment.username.lastname} ({singleComment.username.username})</div>
                  <div className="text-sm text-gray-500">{moment(singleComment.createdAt).format('MMMM DD, YYYY')}</div>
                </div>
                {isEditing && editingCommentId === singleComment._id ? (
                  <div className="mb-2">
                    <input
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Edit your comment"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                    />
                    <div className="flex gap-1 text-base">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600 mr-4"
                          onClick={() => handleEditButton(updatedComment, singleComment._id, selectedActivity._id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>

                    
                  </div>
                ) : (
                  <div className="mb-2">{singleComment.comment}</div>
                )}
                {singleComment.username._id === user._id  && !isEditing && (
                  <div className='text-sm'>
                  <button onClick={() => handleEdit(singleComment._id)} className="text-blue-500 bg-transparent hover:bg-gray-300 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => removeActivity(singleComment._id)} className="text-red-500 bg-transparent hover:bg-gray-300  hover:underline">
                    Delete
                  </button>
                </div>
                )}
              </li>
            ))}
          </ul>

          
          {showModalDelete && (
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-md">
                <p className="text-center mb-4">Are you sure you want to delete this Comment?</p>
                <div className="flex justify-center space-x-4">
                  <button className="px-4 py-2 hover:bg-red-500 text-white rounded-md" onClick={handleConfirmDelete}>
                    Delete
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-300 hover:text-gray-800 rounded-md" onClick={() => setShowModalDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          </div> ) : ( <div>  </div> )}


          <div className="flex flex-col mt-4">
          <input
            className="w-full h-20 p-2 border rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Add your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></input>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600"
            onClick={() => handleSubmit(newComment, selectedActivity?._id)}
          >
            Add Comment
          </button>
        </div>


            
       </div>
      
       
     </div>
     
      ): (
        <div>
          <h2 className='text-3xl font-bold mb-6 mr-4'>Resource Repository</h2>

          <div className='text-xl font-bold mb-4'>View Created Topic</div>
           
          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li
                key={index}
                onClick={() => setShowModalNow(activity._id)}
                className="border rounded-md p-4 mb-4 cursor-pointer transition duration-300 hover:bg-gray-100"
              >
                <div className='text-xl flex items-center justify-center'>
                  <span className='inline-block mr-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center'>
                    {index + 1}
                  </span>
                  <span>{activity.activity}</span>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}

      
    </div>  
  );
};



const CollaborativeLearning = ({ activities, user}) => {
    
   
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showComment, setshowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setcommentCount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState();
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [activityClick, setActivityClick] = useState(null);


  const fetchAllUserActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      // Make a GET request to fetch user activities from the backend
      const response = await fetch('http://localhost:3001/api/user/getAll', {
        method: 'GET',
        headers: {
          // Include any necessary headers (e.g., authorization)
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }

      const data = await response.json();
      // Set the fetched activities in state
      setActivityClick(data.Activities);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const updateClick = async (activityId) => {
    try {
      const updateView = await fetch(`http://localhost:3001/api/user/updateClick/${activityId}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          
      })
      
      const data = await updateView.json();
      console.log(data.message)
    }catch (error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllUserActivities()  ;
  }, [])

  const removeActivity = async (index) => {
    setShowModalDelete(true);
    setCommentToDelete(index)
  };


  const clickShowAnswers = async (id) => {
    setshowComment(prevShowComment => !prevShowComment);
    
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const setShowModalNow = (activityId) => {
    updateClick(activityId);
    const foundActivity = activityClick.find((activity) => activity._id === activityId);
    setSelectedActivity(foundActivity);
    setShowModal(true);
    getAllComments(activityId);
  };

  const getAllComments = async (index) => {
    try{
      const response = await fetch(`http://localhost:3001/api/user/comment/${index}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      setComments(data.comment);
      setcommentCount(data.count);

    } catch (error){
      console.error('Error fetching user comments:', error);
    }
    }

    const handleEditButton = async (comment, commentId, activtyId) => {
      saveEdit(commentId);
      getAllComments(activtyId);
      console.log(getAllComments);
      setIsEditing(false);
    }

    const handleEdit = async (commentId) => {
      setIsEditing(true);
      setEditingCommentId(commentId);
      
      const commentToEdit = comments.find(comment => comment._id === commentId);
      if (commentToEdit) {
        setUpdatedComment(commentToEdit.comment);
      }
      
    }

    const handleDelete = (commentId) => {
      setCommentToDelete(commentId);
      setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user/comment/${commentToDelete}`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        console.log(data)

        getAllComments(selectedActivity._id);
      } catch (error){
        console.log(error);
      }
      setShowModalDelete(false)
    };

    const handleCancelDelete = () => {
      // Close the delete confirmation modal
      setShowDeleteConfirmation(false);
    };


    const saveEdit = async (commentId) =>{
      try {
      const response = await fetch(`http://localhost:3001/api/user/comment/${commentId}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        body: JSON.stringify({comment: updatedComment})
      })
      console.log(response)
    } catch (error){
      console.log(error);
    }
  }


  const [showModalDelete, setShowModalDelete] = useState(false);
  const [newComment, setNewComment] = useState('');


  const handleSubmit = async (comment, id, selected) => {

    const response = await fetch(`http://localhost:3001/api/user/comment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, comment }),
    });
    const data = response.json()
    console.log(data)
    setNewComment('');
    getAllComments(selectedActivity._id);
  };

  return (
    <div className="content">
      
     

      {/* Modal */}
      {showModal ? (
       <div className="p-6 ">
        <div className='flex justify-between'>
          <div className='text-3xl font-bold text-black mb-4'>{selectedActivity?.activity}</div>
          <div>
          <button onClick={closeModal} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'>
            Close
          </button>
          </div>
        </div>
       
       <div className='text-xl text-gray-500'> <span className='font-bold'>Author:</span> {selectedActivity.username.firstname} {selectedActivity.username.lastname} </div>
       <div className='bg-white rounded-lg shadow-md text-xl '>
        <p className='mb-4 mt-6 pt-4'><span className='font-semibold'>Information:</span> {selectedActivity.information}</p>
        <div className=' justify-around grid grid-cols-2 mt-20'>
        <p className='mb-2'>
          <span className='font-semibold'>Status:</span> {selectedActivity.complete ? 'Done' : 'In Progress'}
        </p>
        
        <p className='mb-2'>
          <span className='font-semibold'>Views:</span> {selectedActivity.view} 
        </p>
        
        <p className='mb-2'>
          <span className='font-semibold'>Answered:</span> {commentCount} 
        </p>

        <p className='mb-2'>
          <span className='font-semibold'>Created:</span> {moment(selectedActivity.createdAt).format('MMMM DD, YYYY')}  
        </p>
        
        </div>
        <p className='mb-4 mt-10'>
          <span className='font-semibold'>Answers:  <span className='font-normal text-gray-500 hover:text-blue-700 cursor-pointer' onClick={() => clickShowAnswers(selectedActivity._id)}>   {showComment ? 'Hide Answers...' : 'Reveal Answers...'}</span>  </span>
        </p>
        {showComment ? ( <div>
          
          
          <ul className="max-h-60 overflow-y-auto">
            {comments.map((singleComment, index) => (
              <li key={index} className="bg-gray-100 mb-5 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <div className='font-bold'>{singleComment.username.firstname} {singleComment.username.lastname} ({singleComment.username.username})</div>
                  <div className="text-sm text-gray-500">{moment(singleComment.createdAt).format('MMMM DD, YYYY')}</div>
                </div>
                {isEditing && editingCommentId === singleComment._id ? (
                  <div className="mb-2">
                    <input
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Edit your comment"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                    />
                    <div className="flex gap-1 text-base">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600 mr-4"
                          onClick={() => handleEditButton(updatedComment, singleComment._id, selectedActivity._id)}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>

                    
                  </div>
                ) : (
                  <div className="mb-2">{singleComment.comment}</div>
                )}
                {singleComment.username._id === user._id  && !isEditing && (
                  <div className='text-sm'>
                  <button onClick={() => handleEdit(singleComment._id)} className="text-blue-500 bg-transparent hover:bg-gray-300 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => removeActivity(singleComment._id)} className="text-red-500 bg-transparent hover:bg-gray-300  hover:underline">
                    Delete
                  </button>
                </div>
                )}
              </li>
            ))}
          </ul>

          
          {showModalDelete && (
              <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-md">
                <p className="text-center mb-4">Are you sure you want to delete this Comment?</p>
                <div className="flex justify-center space-x-4">
                  <button className="px-4 py-2 hover:bg-red-500 text-white rounded-md" onClick={handleConfirmDelete}>
                    Delete
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-300 hover:text-gray-800 rounded-md" onClick={() => setShowModalDelete(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          </div> ) : ( <div>  </div> )}


          <div className="flex flex-col mt-4">
          <input
            className="w-full h-20 p-2 border rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Add your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></input>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600"
            onClick={() => handleSubmit(newComment, selectedActivity?._id)}
          >
            Add Comment
          </button>
        </div>


            
       </div>
      
       
     </div>
     
      ): (
        <div>
          <h2 className='text-3xl font-bold mb-6 mr-4'>Collaborative Learning</h2>
          <h2 className='text-2xl font-bold mb-6 mr-4'>Discuss your activities with peers here.</h2>

          <div className='text-xl font-bold mb-4'>Browse Topics</div>
           
          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li
                key={index}
                onClick={() => setShowModalNow(activity._id)}
                className="border rounded-md p-4 mb-4 cursor-pointer transition duration-300 hover:bg-gray-100"
              >
                <div className='text-xl flex items-center justify-center'>
                  <span className='inline-block mr-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center'>
                    {index + 1}
                  </span>
                  <span>{activity.activity}</span>
                </div>
              </li>
            ))}
          </ul>

        </div>
      )}

      
    </div>  
  );
};

const ProgressAnalytics = ({ activities }) => {
  
  const [userProgess, setUserProgress] = useState('');

  useEffect(() => {
    fetchUserProgress();
  },[])

  const textColor = userProgess > 33 ? 'text-white' : 'text-black';

  const fetchUserProgress = async () => {

    const response = await fetch('http://localhost:3001/api/user/analytics',{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
    }
    })
    const data = await response.json();
    setUserProgress(data.Analytics)
  }

  // const calculateProgress = () => {
  //   const completedActivities = activities.filter(
  //     (activity) => activity.activity.trim() !== ""
  //   ).length;
  //   const totalActivities = activities.length;
  //   return totalActivities > 0
  //     ? Math.round((completedActivities / totalActivities) * 100)
  //     : 0;
  // };

  return (
    <div className="content">
    <h2 className="text-2xl font-bold mb-4">Progress Analytics</h2>
    <div className="relative inline-block">
      <div className="overflow-hidden rounded-full bg-gray-200 h-32 w-32">
        <div
          className="bg-teal-600 h-full rounded-full "
          style={{ width: `${userProgess}%` }}
        ></div>
      </div>
      <div className={`absolute inset-0 flex items-center font-bold justify-center text-xl ${textColor}`}>
        {`${userProgess}%`}
      </div>
    </div>
  </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter both username and password.");
    } else {
      try {
        const response = await fetch('http://localhost:3001/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        onLogin(data.token); // Call the function to save the token
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        window.location.reload();
      } catch (error) {
        setError(error.message || 'Login failed');
      }
    }
  };

  return (
    <div className="login-container mx-auto max-w-md p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mt-5 mb-4">Login</h2>
      <form>
        <label className="block mb-4">
          Username:
          <input
            className="block border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Password:
          <input
            className="block border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring focus:border-blue-500"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="block bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-00 focus:outline-none focus:ring focus:border-blue-500"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && <p className="error-message m-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("StudyPlanner");
  const [activities, setActivities] = useState([]);
  const [activitiesAll, setActivitiesAll] = useState([]);
  const [user, setUser] = useState('');
  const token = localStorage.getItem('token');

  const userGet = async () => {
    try{
      const response = await fetch(`http://localhost:3001/api/user/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      setUser(data.user);

    } catch (error){
      console.error('Error fetching user comments:', error);
    }
  }

  // This function handles token refresh
const refreshToken = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:3001/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the refresh token in the headers or body if needed
        Authorization: `Bearer ${token}`,
      },
      // Optionally, send the refresh token in the request body if required by your backend
      // body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    // Update the stored token in localStorage or your authentication context
    localStorage.setItem('token', data.token);
    console.log(data.token);
    // Optionally, update user information or state if returned in the response
    // updateUser(data.user);
  } catch (error) {
    console.error('Token refresh error:', error);
    // Handle token refresh error (e.g., log out the user, show an error message)
  }
};


  // LOGIN HERE 
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchUserActivities();
    fetchAllUserActivities();
    userGet();
    if (token) {
      setLoggedIn(true);
      // Optionally, you might validate the token here (e.g., send it to the server for validation)
    }

    // Perform token refresh when the component mounts or on a timer/interval
    const interval = setInterval(() => {
      refreshToken();
    }, 3600000); // Refresh token every hour (adjust as needed)

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  const fetchUserActivities = async () => {
    
    try {
      // Make a GET request to fetch user activities from the backend
      const response = await fetch('http://localhost:3001/api/user/get', {
        method: 'GET',
        headers: {
          // Include any necessary headers (e.g., authorization)
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }

      const data = await response.json();
      // Set the fetched activities in state
      setActivities(data.Activity);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const fetchAllUserActivities = async () => {
    const token = localStorage.getItem('token');
    try {
      // Make a GET request to fetch user activities from the backend
      const response = await fetch('http://localhost:3001/api/user/getAll', {
        method: 'GET',
        headers: {
          // Include any necessary headers (e.g., authorization)
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }

      const data = await response.json();
      // Set the fetched activities in state
      setActivitiesAll(data.Activities);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  // LOGOUT HERE
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    window.location.reload();


  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleAddActivity = (activity) => {
    setActivities([...activities, activity]);
  };



  const handleRemoveActivity = (index) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "StudyPlanner":
        return (
          <StudyPlanner
            onNavigate={handleNavigate}
            onAddActivity={handleAddActivity}
            onRemoveActivity={handleRemoveActivity}
            activities={activities}
          />
        );
      case "ResourceRepository":
        return (
          <ResourceRepository
            activities={activities}
            user={user}
            onRemoveActivity={handleRemoveActivity}
          />
        );
      case "CollaborativeLearning":
        return (
          <CollaborativeLearning
            activities={activitiesAll}
            user={user}
          />
        );
      case "ProgressAnalytics":
        return <ProgressAnalytics activities={activities} />;
      default:
        return null;
    }
  };

  const [showLoginForm, setShowLoginForm] = useState(true);
  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };


  
  return (
    <div className="App">
      <header>
        <h1 className='text-3xl font-bold'>StudyBuddy</h1>
        
      </header>
      {!loggedIn ? (
        showLoginForm ? (
          <>
            <LoginForm onLogin={handleLogin} />
            <p className="flex justify-center gap-2 items-center mt-4">
            Don't have an account yet?{'  '}
            <span className="cursor-pointer text-blue-500" onClick={toggleForm}>
            {'  '}Register here
            </span>
          </p>
            
          </>
        ) : (
          <>
            <RegistrationForm />
            <p className="flex justify-center gap-2 items-center mt-4">
            Already have an Account?{'  '}
            <span className="cursor-pointer text-blue-500" onClick={toggleForm}>
            {'  '}Login here
            </span>
            </p>
          </>
        )
      ) : (
        <div>
          <div className="nav-buttons">
            <button onClick={() => setCurrentPage("StudyPlanner")}>
              Study Planner
            </button>
            <button onClick={() => setCurrentPage("ResourceRepository")}>
              Resource Repository
            </button>
            <button onClick={() => setCurrentPage("CollaborativeLearning")}>
              Collaborative Learning
            </button>
            <button onClick={() => setCurrentPage("ProgressAnalytics")}>
              Progress Analytics
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
          {renderPage()}
        </div>
      )}
    </div>
  );
};

export default App;
