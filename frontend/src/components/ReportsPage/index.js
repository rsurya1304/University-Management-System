import React, { Component } from 'react';
import ModulePage from '../ModulePage';
import './index.css';

class ReportsPage extends Component {
  render() {
    return (
      <section className="reports-page">
        <ModulePage
          canManage={false}
          title="Admin Reports"
          singular="report"
          detail="Summary counts for students, fee status, pass/fail, scheduled classes, and workload."
          endpoint="/reports/summary"
          idField="metric"
          columns={[
            { key: 'metric', label: 'Metric' },
            { key: 'value', label: 'Value' },
          ]}
          formFields={[]}
          getRecordLabel={(record) => record.metric}
        />
      </section>
    );
  }
}

export default ReportsPage;
