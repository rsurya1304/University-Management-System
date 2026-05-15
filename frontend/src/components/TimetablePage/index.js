import React, { Component } from 'react';
import ModulePage from '../ModulePage';
import './index.css';

class TimetablePage extends Component {
  canManageTimetable() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN' || accessLevel === 'PROFESSOR';
  }

  render() {
    const canManage = this.canManageTimetable();

    return (
      <section className="timetable-page">
        <ModulePage
          canManage={canManage}
          title="Timetable"
          singular="timetable entry"
          detail="Schedule course, professor, class, room, day, and time."
          endpoint="/timetables"
          idField="timetableId"
          columns={[
            { key: 'timetableId', label: 'ID' },
            { key: 'dayOfWeek', label: 'Day' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
            { key: 'room', label: 'Room' },
            { key: 'course.courseName', label: 'Course' },
            { key: 'professor.professorName', label: 'Professor' },
          ]}
          formFields={[
            { name: 'dayOfWeek', label: 'Day', required: true },
            { name: 'startTime', label: 'Start time', required: true },
            { name: 'endTime', label: 'End time', required: true },
            { name: 'room', label: 'Room', required: true },
            {
              name: 'courseId',
              label: 'Course',
              type: 'select',
              optionsEndpoint: '/courses',
              optionValue: (option) => option.courseId,
              optionLabel: (option) => option.courseName,
              fromRecord: (record) => record.course?.courseId || '',
              required: true,
            },
            {
              name: 'professorId',
              label: 'Professor',
              type: 'select',
              optionsEndpoint: '/professors',
              optionValue: (option) => option.professorId,
              optionLabel: (option) => option.professorName,
              fromRecord: (record) => record.professor?.professorId || '',
            },
          ]}
          buildBody={(form) => ({
            dayOfWeek: form.dayOfWeek,
            startTime: form.startTime,
            endTime: form.endTime,
            room: form.room,
            course: { courseId: Number(form.courseId) },
            professor: form.professorId ? { professorId: Number(form.professorId) } : null,
          })}
          getRecordLabel={(record) => `${record.dayOfWeek} ${record.course?.courseName || ''}`}
        />
      </section>
    );
  }
}

export default TimetablePage;
