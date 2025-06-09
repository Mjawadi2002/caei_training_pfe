import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import { FaFileDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formations, setFormations] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [formationsRes, enrollmentsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/formations', { headers }),
          axios.get('http://localhost:5000/api/v1/enrollment', { headers }),
          axios.get('http://localhost:5000/api/v1/users', { headers })
        ]);

        setFormations(formationsRes.data);
        setEnrollments(enrollmentsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch statistics data');
        toast.error(err.response?.data?.error || 'Failed to fetch statistics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for Courses per Category chart
  const categoryData = formations.reduce((acc, formation) => {
    acc[formation.category] = (acc[formation.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  // Prepare data for Enrollments per Course chart
  const enrollmentData = formations.map(formation => {
    const count = enrollments.filter(e => e.formation_title === formation.title).length;
    return {
      title: formation.title,
      count
    };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 courses

  const enrollmentChartData = {
    labels: enrollmentData.map(d => d.title),
    datasets: [
      {
        label: 'Number of Enrollments',
        data: enrollmentData.map(d => d.count),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Prepare data for Students enrolled over time
  const monthlyEnrollments = enrollments.reduce((acc, enrollment) => {
    const date = new Date(enrollment.registration_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  // Sort the months chronologically
  const sortedMonths = Object.keys(monthlyEnrollments).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return yearA === yearB 
      ? months.indexOf(monthA) - months.indexOf(monthB)
      : parseInt(yearA) - parseInt(yearB);
  });

  // Calculate total enrollments and average per month
  const totalEnrollments = Object.values(monthlyEnrollments).reduce((a, b) => a + b, 0);
  const averageEnrollments = totalEnrollments / sortedMonths.length;

  const timeChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Enrollments per Month',
        data: sortedMonths.map(month => monthlyEnrollments[month]),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Average Enrollments',
        data: sortedMonths.map(() => averageEnrollments),
        borderColor: '#FF6384',
        borderDash: [5, 5],
        fill: false,
      }
    ],
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const reportElement = reportRef.current;
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add title
      pdf.setFontSize(20);
      pdf.text('CAEI Training Statistics Report', pdfWidth / 2, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      const today = new Date().toLocaleDateString();
      pdf.text(`Generated on: ${today}`, pdfWidth / 2, 30, { align: 'center' });

      // Add the charts
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Add summary
      const summaryY = imgY + imgHeight * ratio + 20;
      pdf.setFontSize(14);
      pdf.text('Summary', pdfWidth / 2, summaryY, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Total Enrollments: ${totalEnrollments}`, 20, summaryY + 10);
      pdf.text(`Average Enrollments per Month: ${averageEnrollments.toFixed(1)}`, 20, summaryY + 20);
      pdf.text(`Total Courses: ${formations.length}`, 20, summaryY + 30);
      pdf.text(`Total Categories: ${Object.keys(categoryData).length}`, 20, summaryY + 40);

      // Save the PDF
      pdf.save('caei-training-statistics.pdf');
      
      toast.success('Report generated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <ToastContainer />
      <h2 className="mb-4">Application Statistics</h2>
      
      <div ref={reportRef}>
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Courses per Category</Card.Title>
                <div style={{ height: '300px' }}>
                  <Pie 
                    data={categoryChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Top 5 Courses by Enrollments</Card.Title>
                <div style={{ height: '300px' }}>
                  <Bar 
                    data={enrollmentChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        x: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={12} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Enrollments Over Time</Card.Title>
                <div className="mb-3">
                  <p className="text-muted">
                    Total Enrollments: {totalEnrollments} | 
                    Average per Month: {averageEnrollments.toFixed(1)}
                  </p>
                </div>
                <div style={{ height: '300px' }}>
                  <Line 
                    data={timeChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.dataset.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Row className="mt-4">
        <Col className="text-center">
          <Button
            variant="success"
            onClick={generateReport}
            disabled={generatingReport}
            className="download-report-btn"
            style={{
              padding: '12px 30px',
              fontSize: '1.1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              backgroundColor: '#28a745',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            {generatingReport ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <FaFileDownload size={20} />
                <span>Download Statistics Report</span>
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminStatistics; 