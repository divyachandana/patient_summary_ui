import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Autocomplete, TextField, List, ListItem, ListItemText, ListItemIcon, Divider, CircularProgress } from '@mui/material';
import { HealthAndSafety, Person, Sick, Healing, ReportProblem, CalendarToday, Vaccines, Medication, Visibility, Build, Summarize } from '@mui/icons-material';
import { useDebounce } from 'use-debounce';
import './Sidebar.css';

// Function to fetch patients based on the search query
const fetchPatients = async (query) => {
  const { data } = await axios.get(`http://localhost:8000/search?q=${query}`);
  return data;
};

// Array of category objects with their names and icons
const categories = [
  { name: 'Health Summary', icon: <HealthAndSafety /> },
  { name: 'Personal Details', icon: <Person /> },
  { name: 'Allergies', icon: <Sick /> },
  { name: 'Careplans', icon: <Healing /> },
  { name: 'Conditions', icon: <ReportProblem /> },
  { name: 'Encounters', icon: <CalendarToday /> },
  { name: 'Immunizations', icon: <Vaccines /> },
  { name: 'Medications', icon: <Medication /> },
  { name: 'Observations', icon: <Visibility /> },
  { name: 'Procedures', icon: <Build /> },
  { name: 'Visit Summary', icon: <Summarize /> }
];

function Sidebar({ onCategorySelect, onPatientChange }) {
  // State for storing the search term
  const [searchTerm, setSearchTerm] = useState('');
  // Debounced version of the search term to reduce API calls
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  // State for the selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);
  // State for the selected category
  const [selectedCategory, setSelectedCategory] = useState('Health Summary');

  // Query to fetch patients based on the debounced search term
  const { data: patients = [], isLoading } = useQuery(['patients', debouncedSearchTerm], () => fetchPatients(debouncedSearchTerm), {
    enabled: !!debouncedSearchTerm,
  });

  // Handler for changing the selected patient
  const handlePatientChange = (event, value) => {
    setSelectedPatient(value);
    if (value && value.id) {
      console.log('Selected patient ID:', value.id);
      setSelectedCategory('Health Summary'); // Reset category to Health Summary
      onPatientChange(value.id);
    }
  };

  // Handler for selecting a category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    console.log('Selected category:', category.name);
    onCategorySelect(category.name, selectedPatient ? selectedPatient.id : null);
  };

  return (
    <aside className="sidebar">
      <h2>Patients</h2>
      <Autocomplete
        options={patients.map((patient) => ({
          label: `${patient.first} ${patient.last} (${patient.id})`,
          id: patient.id,
        }))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Patients"
            variant="outlined"
            margin="normal"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        value={selectedPatient}
        onChange={handlePatientChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        fullWidth
        className="search-bar"
      />
      <Divider className="divider" />
      <h2>Categories</h2>
      <List>
        {categories.map(category => (
          <ListItem
            key={category.name}
            onClick={() => handleCategorySelect(category)}
            className={`category-item ${selectedCategory === category.name ? 'selected' : ''}`}
          >
            <ListItemIcon>{category.icon}</ListItemIcon>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </aside>
  );
}

export default Sidebar;
