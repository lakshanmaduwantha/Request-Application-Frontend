import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateRequestForm = ({ onClose, onSubmit, request }) => {
    const [formData, setFormData] = useState({
        created_on: '',
        location: '',
        service: '',
        priority: 'LOW',
        department: '',
        status: 'NEW',
        requested_by: '',
        assigned_to: '',
    });

    useEffect(() => {
        if (request) {
            setFormData({
                created_on: request.created_on,
                location: request.location,
                service: request.service,
                priority: request.priority,
                department: request.department,
                status: request.status,
                requested_by: request.requested_by,
                assigned_to: request.assigned_to,
            });
        }
    }, [request]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (request) {
                response = await axios.put(`http://localhost:8000/api/requests/${request.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                response = await axios.post('http://localhost:8000/api/requests', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            onSubmit(response.data.data);
        } catch (error) {
            console.error('Error submitting request', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input type="date" name="created_on" value={formData.created_on} onChange={handleChange} required />
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                <input type="text" name="service" value={formData.service} onChange={handleChange} required />
                <select name="priority" value={formData.priority} onChange={handleChange} required>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <input type="text" name="requested_by" value={formData.requested_by} onChange={handleChange} required />
                <input type="text" name="assigned_to" value={formData.assigned_to} onChange={handleChange} required />
                <button type="submit">{request ? 'Update Request' : 'Create Request'}</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateRequestForm;
