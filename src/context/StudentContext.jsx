import React, { createContext, useRef, useState } from 'react'

const StudentContext = createContext()

const StudentContextProvider = ({ children }) => {

    const [data, setData] = useState([])
    const [totalSemester, setTotalSemester] = useState({})
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [totalBooksAndFine, setTotalBooksAndFine] = useState({})
    const [userType, setUserType] = useState('')
    const [StaffIDNo, setStaffIDNo] = useState('')
    const [studentIDNo, setStudentIDNo] = useState('')
    const [staffImage, setStaffImage] = useState('')
    const [studentImage, setStudentImage] = useState('')
    const [menuVisible, setMenuVisible] = useState(false);
    const [imageStatus, setImageStatus] = useState('')
    const [mobileToken, setMobileToken] = useState('')
    const ignoreTap = useRef(false);

    const openMenu = (event) => {       
        setTimeout(() => {
    setMenuVisible(true);
    ignoreTap.current = true;
    setTimeout(() => {
      ignoreTap.current = false;
    }, 150);
  }, 50);
    };

    const closeMenu = () => {
        if (ignoreTap.current) return;
        setMenuVisible(false);
    };

    return (
        <StudentContext.Provider value={{ data, setData, isLoggedin, setIsLoggedin, totalSemester, setTotalSemester, totalBooksAndFine, setTotalBooksAndFine, userType, setUserType, StaffIDNo, setStaffIDNo, studentIDNo, setStudentIDNo, staffImage, setStaffImage, studentImage, setStudentImage, openMenu, closeMenu, menuVisible, imageStatus, setImageStatus, mobileToken, setMobileToken }}>
            {children}
        </StudentContext.Provider>
    )
}

export { StudentContext, StudentContextProvider }
