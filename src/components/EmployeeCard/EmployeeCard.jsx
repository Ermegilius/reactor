import { useState} from 'react';
import Button from '../Button/Button';
import './EmployeeCard.css';
import monthsWorked from '../../utilis/monthsWorked';
import getDepartmentClass from "../../utilis/styleUtils";
import Alert from '@mui/material/Alert';
import useAxios from '../../utilis/useAxios';

const currentDate = new Date();

const EmployeeCard = ({id,name,initRole,department,startDate,location,salary,birth, handleNavigate, updatePerson}) => {
  const [isTeamLead, setIsTeamLead] = useState(false);//rerenders in case of pomotion
  const [isFormEditing, setIsFormEditing] = useState(false);//rerenders in case of editting
  const [person, setPerson] = useState({
    name: name,
    initRole: initRole,
    department: department,
    startDate: startDate,
    location: location,
    salary: salary,
    birth: birth,
  });

  const { update, alert } = useAxios('http://localhost:3001/persons');

  const yearsWorked = currentDate.getFullYear() - new Date(startDate).getFullYear();
  const congrats = "Schedule recognition meeting."//use it if it's time for a recognition meeting

  const toggleTeamLead = () => {
    setIsTeamLead((prev) => !prev);//toggles the team lead status
    console.log("clicked person id: " + id);
  };

  const personEditHandler = async () => {
    try{
      if (isFormEditing) {
        const updatedPerson = { ...person, id }; 
        await update(`${id}`, updatedPerson);
        console.log(alert);
        updatePerson(updatedPerson); // update the parent component's state
      }
      setIsFormEditing((prev) => !prev);
      
    } catch (error) {
      console.error("Failed to update person data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <div className = {`card ${getDepartmentClass(person.department)}`}>
      <h2>Name: {name}</h2>
      {isFormEditing ? (
          <div>
            <input name="name" type="text" value={person.name} onChange={handleChange} />
            <input name="initRole" type="text" value={person.initRole} onChange={handleChange} />
            <input name="department" type="text" value={person.department} onChange={handleChange} />
            <input name="startDate" type="date" value={person.startDate} onChange={handleChange} />
            <input name="location" type="text" value={person.location} onChange={handleChange} />
            <input name="salary" type="number" value={person.salary} onChange={handleChange} />
            <input name="birth" type="date" value={person.birth} onChange={handleChange} />
          </div>
        ) : (
          <>
            {alert.show && <Alert severity={alert.type}>{alert.message}</Alert>}
            <p>Role:{isTeamLead ? <span>⭐</span> : ''}{initRole}</p>
            <p>Department: {department}</p>
            <p>Salary: {salary}</p>
            <p>Birth: {birth}</p>
            <p>Location:  {location}</p>
            <p>Years in the company: {yearsWorked}</p>
          </>
        )
      }

      {(yearsWorked % 5 === 0 && yearsWorked !== 0) ? (<p>&#127183;{congrats}</p>):('')}
      {(monthsWorked(startDate, currentDate) < 6) ? (<p>&#9997;Schedule probation review.</p>):('')}

      <div className="card-image">
        <img src={`https://robohash.org/${name}?set=set5`} alt={name} />
      </div>

      <div className='buttonContainer'>
        <Button
          text={isTeamLead ? 'Demote Team Lead' : 'Promote to Team Lead'}
          onClick={toggleTeamLead}
          role= {isTeamLead ? 'primary' : 'secondary'}
          type = 'button'
        />

        <Button
          text={isFormEditing ? 'Save' : 'Edit'}
          onClick={personEditHandler}
          role= {isFormEditing ? 'primary' : 'secondary'}
          type = 'button'
        />

        <Button
          text="More"
          onClick={() => handleNavigate(id)}
        />
      </div>
    </div> 
  );
}

export default EmployeeCard;