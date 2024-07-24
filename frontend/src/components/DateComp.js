import React, { useState } from 'react';


function DateComp({onChange}) {
    const [date, setDate] = useState(new Date());

    const handleChange = (event) => {
        const newDate = event.target.value;
     
        const dateObject = new Date(newDate);
        setDate(dateObject);
        if (onChange) {
          onChange(dateObject);
        }
      };
    

    return (
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={handleChange}
        />
      );

}

export default DateComp
