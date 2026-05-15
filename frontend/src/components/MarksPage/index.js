import React, { Component } from 'react';
import ModulePage from '../ModulePage';
import './index.css';

class MarksPage extends Component {
  canManageMarks() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN' || accessLevel === 'PROFESSOR';
  }

  render() {
    const canManage = this.canManageMarks();

    return (
      <section className="marks-page">
        <ModulePage
          canManage={canManage}
          title="Marks and Results"
          singular="mark"
          detail="Marks are out of 100; percentage, grade, and pass/fail are calculated by backend."
          endpoint={canManage ? '/marks' : '/me/marks'}
          idField="markId"
          columns={[
            { key: 'markId', label: 'ID' },
            { key: 'student.studentName', label: 'Student' },
            { key: 'course.courseName', label: 'Course' },
            { key: 'semester.semesterName', label: 'Semester' },
            { key: 'marks', label: 'Marks' },
            { key: 'percentage', label: '%' },
            { key: 'grade', label: 'Grade' },
            { key: 'result', label: 'Result' },
          ]}
          formFields={[
            {
              name: 'studentId',
              label: 'Student',
              type: 'select',
              optionsEndpoint: '/students',
              optionValue: (option) => option.studentId,
              optionLabel: (option) => option.studentName,
              fromRecord: (record) => record.student?.studentId || '',
              required: true,
            },
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
              name: 'semesterId',
              label: 'Semester',
              type: 'select',
              optionsEndpoint: '/semesters',
              optionValue: (option) => option.semesterId,
              optionLabel: (option) => option.semesterName,
              fromRecord: (record) => record.semester?.semesterId || '',
            },
            { name: 'marks', label: 'Marks out of 100', type: 'number', required: true },
          ]}
          buildBody={(form) => ({
            student: { studentId: Number(form.studentId) },
            course: { courseId: Number(form.courseId) },
            semester: form.semesterId ? { semesterId: Number(form.semesterId) } : null,
            marks: Number(form.marks),
          })}
          getRecordLabel={(record) => `${record.student?.studentName || 'Result'} ${record.course?.courseName || ''}`}
        />
      </section>
    );
  }
}

export default MarksPage;
