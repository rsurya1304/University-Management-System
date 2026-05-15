import React, { Component } from 'react';
import MetricCard from '../MetricCard';
import PermissionList from '../PermissionList';
import './index.css';

class Overview extends Component {
  render() {
    const { counts, courses, profile, session } = this.props;
    const totalCredits = courses.reduce(
      (sum, course) => sum + Number(course.credits || 0),
      0
    );

    return (
      <section className="overview-layout">
        <div className="stat-grid">
          <MetricCard label="Students" value={counts.students} detail="Active records" />
          <MetricCard
            label="Professors"
            value={counts.professors}
            detail="Faculty profiles"
          />
          <MetricCard label="Courses" value={counts.courses} detail="Published classes" />
          <MetricCard label="Credits" value={totalCredits} detail="Across catalog" />
        </div>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Current access</p>
              <h2>{session.fullName}</h2>
            </div>
            <span className="role-badge">{profile.label}</span>
          </div>
          <PermissionList permissions={profile.permissions} />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Recent catalog</p>
              <h2>Course load</h2>
            </div>
          </div>
          <div className="course-stack">
            {courses.slice(0, 5).map((course) => (
              <div className="course-row" key={course.courseId}>
                <strong>{course.courseName}</strong>
                <span>
                  {course.credits} credits
                  {course.professor?.professorName
                    ? ` with ${course.professor.professorName}`
                    : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>
    );
  }
}

export default Overview;
