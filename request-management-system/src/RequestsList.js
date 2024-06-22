import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RequestsList.css'; // Import your updated styles

const RequestsList = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/requests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.status === 'success') {
                    setRequests(response.data.data); // Set the array of requests
                } else {
                    console.error('Failed to fetch requests:', response.data);
                }
            } catch (error) {
                console.error('Error fetching requests', error);
            }
        };

        fetchRequests();
    }, []); // Empty dependency array to run effect only once

    const getStatusClassName = (status) => {
        switch (status) {
            case 'NEW':
                return 'status-new';
            case 'IN_PROGRESS':
                return 'status-in-progress';
            case 'ON_HOLD':
            case 'CANCELLED':
                return 'status-on-hold';
            case 'REJECTED':
                return 'status-rejected';
            default:
                return '';
        }
    };

    return (
        <div className="requests-list-container">
            <div className="requests-list">
                <div className="request-items">
                    <h2>Requests List</h2>
                    {requests.map(request => (
                        <div key={request.id} className={`request-item ${getStatusClassName(request.status)}`}>
                            <div className="request-details">
                                <strong>Request ID:</strong> {request.id}<br />
                                <strong>Created On:</strong> {request.created_on}<br />
                                <strong>Location:</strong> {request.location}<br />
                                <strong>Service:</strong> {request.service}<br />
                                <strong>Status:</strong> {request.status}<br />
                                <strong>Priority:</strong> {request.priority}<br />
                                <strong>Department:</strong> {request.department}<br />
                                <strong>Requested By:</strong> {request.creator.name}<br />
                                <strong>Assigned To:</strong> {request.assignee.name}<br />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RequestsList;
