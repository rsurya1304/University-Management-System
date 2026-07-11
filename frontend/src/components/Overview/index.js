import React, { Component } from 'react';
import MetricCard from '../MetricCard';
import PermissionList from '../PermissionList';
import './index.css';

class Overview extends Component {
  render() {
    const { counts, courses, fees = [], marks = [], profile, session, studentProfile } = this.props;
    const isStudent = session.accessLevel === 'STUDENT';
    const totalCredits = courses.reduce(
      (sum, course) => sum + Number(course.credits || 0),
      0
    );
    const paidFees = fees.filter((fee) => fee.status === 'PAID').length;
    const averageMarks = marks.length
      ? Math.round(
          marks.reduce((sum, mark) => sum + Number(mark.marks || 0), 0) / marks.length
        )
      : 0;

    return (
      <section className="overview-layout">
        <div className="stat-grid">
          {isStudent ? (
            <>
              <MetricCard label="My courses" value={counts.courses} detail="Registered classes" />
              <MetricCard label="Credits" value={totalCredits} detail="Current load" />
              <MetricCard label="Fee records" value={fees.length} detail={`${paidFees} paid`} />
              <MetricCard label="Average" value={averageMarks} detail="Marks overview" />
            </>
          ) : (
            <>
              <MetricCard label="Students" value={counts.students} detail="Active records" />
              <MetricCard
                label="Professors"
                value={counts.professors}
                detail="Faculty profiles"
              />
              <MetricCard label="Courses" value={counts.courses} detail="Published classes" />
              <MetricCard label="Credits" value={totalCredits} detail="Across catalog" />
            </>
          )}
        </div>

        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{isStudent ? 'My profile' : 'Current access'}</p>
              <h2>{studentProfile?.studentName || session.fullName}</h2>
              {isStudent && <span className="panel-detail">{session.email}</span>}
            </div>
            <span className="role-badge">{profile.label}</span>
          </div>
          {isStudent ? (
            <div className="student-summary-grid">
              <span>Use Courses to register or withdraw from available classes.</span>
              <span>Fees and Marks show only records connected to your account email.</span>
            </div>
          ) : (
            <PermissionList permissions={profile.permissions} />
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{isStudent ? 'Registered courses' : 'Recent catalog'}</p>
              <h2>{isStudent ? 'My course load' : 'Course load'}</h2>
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
            {!courses.length && (
              <div className="empty-state">No registered courses yet. Open Courses to register.</div>
            )}
          </div>
        </section>
      </section>
    );
  }
}

export default Overview;
