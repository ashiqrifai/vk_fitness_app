import React, {useEffect} from 'react';
import { useClub } from '../context/ClubContext'; // Adjust the import path as needed

function ClubList() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const clubs = userInfo ? userInfo.clubs : [];
    const { selectedClub, setSelectedClub } = useClub();


    useEffect(() => {
        if (!selectedClub && clubs.length > 0) {
            setSelectedClub(clubs[0]);
        }
    }, [selectedClub, clubs, setSelectedClub]);

    const handleSelectChange = (event) => {
        const clubId = event.target.value;
        const club = clubs.find(club => club.club_id === parseInt(clubId, 10));
        setSelectedClub(club);
    };

    return (
        <select value={selectedClub ? selectedClub.club_id : ''} onChange={handleSelectChange}>
           
            {clubs.map(club => (
                <option key={club.club_id} value={club.club_id}>
                    {club.clubname} - {club.clubcity}
                </option>
            ))}
        </select>
    );
}

export default ClubList;
