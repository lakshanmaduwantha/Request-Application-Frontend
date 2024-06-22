import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateRequestForm from './CreateRequestForm';
import './styles.css'; // Import CSS file

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editRequest, setEditRequest] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/requests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.status === 'success') {
                    setRequests(response.data.data);
                } else {
                    console.error('Failed to fetch requests:', response.data);
                }
            } catch (error) {
                console.error('Error fetching requests', error);
            }
        };

        fetchRequests();
    }, []);

    const openForm = (request = null) => {
        setEditRequest(request);
        setShowForm(true);
    };

    const closeForm = () => {
        setEditRequest(null);
        setShowForm(false);
    };

    const handleFormSubmit = (updatedRequest) => {
        if (editRequest) {
            setRequests(requests.map(req => (req.id === updatedRequest.id ? updatedRequest : req)));
        } else {
            setRequests([...requests, updatedRequest]);
        }
        closeForm();
    };

    const deleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRequests(requests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error deleting request', error);
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'NEW':
                return 'status-new';
            case 'IN_PROGRESS':
                return 'status-in-progress';
            case 'ON_HOLD':
                return 'status-on-hold';
            case 'REJECTED':
                return 'status-rejected';
            case 'CANCELLED':
                return 'status-cancelled';
            default:
                return ''; // Default color or class for other statuses
        }
    };

    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case 'HIGH':
                return 'priority-high';
            case 'MEDIUM':
                return 'priority-medium';
            case 'LOW':
                return 'priority-low';
            default:
                return ''; // Default class for other priorities
        }
    };

    return (
        <div>
            <button onClick={() => openForm()} className="new-request-btn">New Request</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created On</th>
                        <th>Location</th>
                        <th>Service</th>
                        <th>Priority</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Requested By</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.created_on}</td>
                            <td>{request.location}</td>
                            <td>{request.service}</td>
                            <td className={getPriorityColorClass(request.priority)}>{request.priority}</td>
                            <td>{request.department}</td>
                            <td className={getStatusColorClass(request.status)}>{request.status}</td>
                            <td>{request.creator.name}</td>
                            <td>{request.assignee.name}</td>
                            <td>
                                <button onClick={() => openForm(request)}>Update</button>
                                <button onClick={() => deleteRequest(request.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showForm && <CreateRequestForm onClose={closeForm} onSubmit={handleFormSubmit} request={editRequest} />}
        </div>
    );
};

export default Dashboard;
