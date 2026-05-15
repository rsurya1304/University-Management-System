import React, { Component } from 'react';
import ModulePage from '../ModulePage';
import './index.css';

class AcademicPage extends Component {
  canManageAcademic() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN' || accessLevel === 'REGISTRAR';
  }

  render() {
    const canManage = this.canManageAcademic();

    return (
      <section className="academic-page module-stack">
        <ModulePage
          canManage={canManage}
          title="Departments"
          singular="department"
          detail="Organize the university by academic departments."
          endpoint="/departments"
          idField="departmentId"
          columns={[
            { key: 'departmentId', label: 'ID' },
            { key: 'departmentName', label: 'Department' },
            { key: 'code', label: 'Code' },
          ]}
          formFields={[
            { name: 'departmentName', label: 'Department name', required: true },
            { name: 'code', label: 'Code', required: true },
          ]}
          getRecordLabel={(record) => record.departmentName}
        />

        <ModulePage
          canManage={canManage}
          title="Semesters"
          singular="semester"
          detail="Map semesters to departments."
          endpoint="/semesters"
          idField="semesterId"
          columns={[
            { key: 'semesterId', label: 'ID' },
            { key: 'semesterName', label: 'Semester' },
            { key: 'semesterNumber', label: 'No.' },
            { key: 'department.departmentName', label: 'Department' },
          ]}
          formFields={[
            { name: 'semesterName', label: 'Semester name', required: true },
            { name: 'semesterNumber', label: 'Semester number', type: 'number', required: true },
            {
              name: 'departmentId',
              label: 'Department',
              type: 'select',
              optionsEndpoint: '/departments',
              optionValue: (option) => option.departmentId,
              optionLabel: (option) => option.departmentName,
              fromRecord: (record) => record.department?.departmentId || '',
            },
          ]}
          buildBody={(form) => ({
            semesterName: form.semesterName,
            semesterNumber: Number(form.semesterNumber),
            department: form.departmentId ? { departmentId: Number(form.departmentId) } : null,
          })}
          getRecordLabel={(record) => record.semesterName}
        />

        <ModulePage
          canManage={canManage}
          title="Classes"
          singular="class"
          detail="Connect class sections with department and semester."
          endpoint="/classes"
          idField="classId"
          columns={[
            { key: 'classId', label: 'ID' },
            { key: 'className', label: 'Class' },
            { key: 'section', label: 'Section' },
            { key: 'department.departmentName', label: 'Department' },
            { key: 'semester.semesterName', label: 'Semester' },
          ]}
          formFields={[
            { name: 'className', label: 'Class name', required: true },
            { name: 'section', label: 'Section', required: true },
            {
              name: 'departmentId',
              label: 'Department',
              type: 'select',
              optionsEndpoint: '/departments',
              optionValue: (option) => option.departmentId,
              optionLabel: (option) => option.departmentName,
              fromRecord: (record) => record.department?.departmentId || '',
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
          ]}
          buildBody={(form) => ({
            className: form.className,
            section: form.section,
            department: form.departmentId ? { departmentId: Number(form.departmentId) } : null,
            semester: form.semesterId ? { semesterId: Number(form.semesterId) } : null,
          })}
          getRecordLabel={(record) => `${record.className} ${record.section}`}
        />

        <ModulePage
          canManage={canManage}
          title="Syllabus"
          singular="syllabus"
          detail="Maintain syllabus copies by course and semester."
          endpoint="/syllabi"
          idField="syllabusId"
          columns={[
            { key: 'syllabusId', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'course.courseName', label: 'Course' },
            { key: 'semester.semesterName', label: 'Semester' },
          ]}
          formFields={[
            { name: 'title', label: 'Title', required: true },
            { name: 'description', label: 'Description', required: true },
            {
              name: 'courseId',
              label: 'Course',
              type: 'select',
              optionsEndpoint: '/courses',
              optionValue: (option) => option.courseId,
              optionLabel: (option) => option.courseName,
              fromRecord: (record) => record.course?.courseId || '',
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
          ]}
          buildBody={(form) => ({
            title: form.title,
            description: form.description,
            course: form.courseId ? { courseId: Number(form.courseId) } : null,
            semester: form.semesterId ? { semesterId: Number(form.semesterId) } : null,
          })}
          getRecordLabel={(record) => record.title}
        />
      </section>
    );
  }
}

export default AcademicPage;
