/**
 * Meeting Service
 * 
 * Handles all API calls related to meetings.
 */

import api from './api';

export const meetingService = {
  /**
   * Create a new meeting
   * @param {{ title: string, description: string }} data 
   */
  createMeeting: (data) => api.post('/meetings', data),

  /**
   * Fetch all meetings hosted by the current user
   */
  getMyMeetings: () => api.get('/meetings'),

  /**
   * Get details of a specific meeting
   * @param {string} meetingId 
   */
  getMeetingDetails: (meetingId) => api.get(`/meetings/${meetingId}`),
};
