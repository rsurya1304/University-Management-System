import React, { Component } from 'react';
import ModulePage from '../ModulePage';
import './index.css';

class FeesPage extends Component {
  canManageFees() {
    const { accessLevel } = this.props.session;
    return accessLevel === 'ADMIN' || accessLevel === 'REGISTRAR';
  }

  render() {
    const canManage = this.canManageFees();

    return (
      <section className="fees-page">
        <ModulePage
          canManage={canManage}
          title="Fees"
          singular="fee"
          detail="Track amount, due date, payment date, and payment status."
          endpoint={canManage ? '/fees' : '/me/fees'}
          idField="feeId"
          columns={[
            { key: 'feeId', label: 'ID' },
            { key: 'student.studentName', label: 'Student' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'dueDate', label: 'Due date' },
            { key: 'paymentDate', label: 'Payment date' },
          ]}
          formFields={[
            {
              name: 'studentId',
              label: 'Student',
              type: 'select',
              optionsEndpoint: '/students',
              optionValue: (option) => option.studentId,
              optionLabel: (option) => `${option.studentName} (${option.email})`,
              fromRecord: (record) => record.student?.studentId || '',
              required: true,
            },
            { name: 'amount', label: 'Amount', type: 'number', required: true },
            { name: 'status', label: 'Status', required: true, defaultValue: 'PENDING' },
            { name: 'dueDate', label: 'Due date', type: 'date', required: true },
            { name: 'paymentDate', label: 'Payment date', type: 'date' },
          ]}
          buildBody={(form) => ({
            student: { studentId: Number(form.studentId) },
            amount: Number(form.amount),
            status: form.status,
            dueDate: form.dueDate,
            paymentDate: form.paymentDate || null,
          })}
          getRecordLabel={(record) => `${record.student?.studentName || 'Fee'} ${record.amount}`}
        />
      </section>
    );
  }
}

export default FeesPage;
