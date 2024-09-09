import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeacherService from './TeacherService'; // Ensure you import your service

const TeacherForm = () => {
    const { id } = useParams(); // Get the teacher ID from the URL if editing
    const navigate = useNavigate(); // Hook for navigation
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [pwd, setPwd] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch teacher data if ID is present (editing mode)
    useEffect(() => {
        if (id) {
            const fetchTeacher = async () => {
                try {
                    const response = await TeacherService.getTeacherById(id);
                    const teacher = response.data;
                    setName(teacher.name);
                    setEmail(teacher.email);
                    setTel(teacher.tel);
                    setPwd(''); // Do not pre-fill password
                } catch (error) {
                    console.error('Error fetching teacher data:', error);
                    alert('Failed to fetch teacher data.');
                }
            };
            fetchTeacher();
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset previous errors
        setErrors({});

        // Basic client-side validation
        if (!name || !email || !tel || (pwd === undefined)) {
            alert('All fields are required!');
            return;
        }

        const teacherData = { name, email, tel, pwd: pwd || undefined };

        try {
            setLoading(true); // Start loading
            if (id) {
                // Update teacher if ID is present
                await TeacherService.updateTeacher(id, teacherData);
                alert('Teacher updated successfully!');
            } else {
                // Create teacher if ID is not present
                await TeacherService.createTeacher(teacherData);
                alert('Teacher created successfully!');
            }
            navigate('/admin/Listprof'); // Redirect after submission
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Handle validation errors
                console.error('Validation Errors:', error.response.data.errors);
                setErrors(error.response.data.errors);
                alert('Error: ' + JSON.stringify(error.response.data.errors));
            } else {
                // Handle other errors
                console.error('Error saving teacher:', error);
                alert('An error occurred while saving the teacher.');
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <center>
        <div style={{
            padding : "10px", border:"solid #9C4D6B 5px",width:"50%",margin:"25PX"
        }}>
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p>{errors.name}</p>}
            </label>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p>{errors.email}</p>}
            </label>
            <label>
                Tel:
                <input
                    type="text"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                />
                {errors.tel && <p>{errors.tel}</p>}
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                />
                {errors.pwd && <p>{errors.pwd}</p>}
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : (id ? 'Update' : 'Submit')}
            </button>
        </form>
        </div></center>
    );
};

export default TeacherForm;