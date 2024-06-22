import React, { useState } from 'react';
import axios from 'axios';
import './CreateRequest.css'; // Import your updated styles

const CreateRequestForm = ({ onClose }) => {
    const [location, setLocation] = useState('');
    const [service, setService] = useState('');
    const [priority, setPriority] = useState('');
    const [department, setDepartment] = useState('');
    const [requestedBy, setRequestedBy] = useState(''); // Assuming this will be a user ID
    const [assignedTo, setAssignedTo] = useState('');   // Assuming this will be a user ID
    const [status, setStatus] = useState('NEW'); // Default status
    const [errorMessages, setErrorMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/requests', {
                created_on: new Date().toISOString(), // Placeholder for created_on field
                location,
                service,
                status,
                priority,
                department,
                requested_by: requestedBy,
                assigned_to: assignedTo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Request created:', response.data);
            onClose(); // Close modal after successful submission
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const messages = Object.keys(errors).map(field => errors[field].join(', '));
                setErrorMessages(messages);
            } else {
                console.error('Error creating request:', error);
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Create New Request</h2>
                {errorMessages.length > 0 && (
                    <div className="error-messages">
                        <ul>
                            {errorMessages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <label>
                        Location:
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </label>
                    <label>
                        Service:
                        <input type="text" value={service} onChange={(e) => setService(e.target.value)} required />
                    </label>
                    <label>
                        Priority:
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                            <option value="">Select Priority</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </label>
                    <label>
                        Department:
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                    </label>
                    <label>
                        Requested By:
                        <input type="text" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} required />
                    </label>
                    <label>
                        Assigned To:
                        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
                    </label>
                    <label>
                        Status:
                        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="ON_HOLD">On Hold</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestForm;
