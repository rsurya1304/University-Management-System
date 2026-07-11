import React, { Component } from 'react';
import { getProfile } from '../../config/access';
import ModulePage from '../ModulePage';

const ACCESS_OPTIONS = [
  { value: 'STUDENT', label: 'Students' },
  { value: 'PROFESSOR', label: 'Professors' },
  { value: 'ADMIN', label: 'Administrators' },
];

const PRIORITY_OPTIONS = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

class AnnouncementsPage extends Component {
  render() {
    const profile = getProfile(this.props.session.accessLevel);
    const canManage = profile.label === 'Administrator';

    return (
      <ModulePage
        title="Announcements"
        singular="announcement"
        detail="Publish university notices for students, professors, and administrators."
        endpoint="/announcements"
        idField="announcementId"
        canManage={canManage}
        getRecordLabel={(record) => record.title}
        columns={[
          { key: 'announcementId', label: 'ID' },
          { key: 'title', label: 'Title' },
          { key: 'audience', label: 'Audience' },
          { key: 'priority', label: 'Priority' },
          { key: 'publishDate', label: 'Published' },
          { key: 'expiresOn', label: 'Expires' },
          { key: 'message', label: 'Message' },
        ]}
        formFields={[
          {
            name: 'title',
            label: 'Title',
            placeholder: 'Exam schedule published',
            required: true,
          },
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            placeholder: 'Write the announcement details',
            required: true,
          },
          {
            name: 'audience',
            label: 'Audience',
            type: 'select',
            defaultValue: 'STUDENT',
            options: ACCESS_OPTIONS,
            optionValue: (option) => option.value,
            optionLabel: (option) => option.label,
            required: true,
          },
          {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            defaultValue: 'NORMAL',
            options: PRIORITY_OPTIONS,
            optionValue: (option) => option.value,
            optionLabel: (option) => option.label,
            required: true,
          },
          {
            name: 'publishDate',
            label: 'Publish date',
            type: 'date',
            required: true,
          },
          {
            name: 'expiresOn',
            label: 'Expires on',
            type: 'date',
          },
        ]}
      />
    );
  }
}

export default AnnouncementsPage;
