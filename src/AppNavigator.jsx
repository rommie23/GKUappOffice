import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import Login from './StudentSide/screens/Login'
// import Splash from './StudentSide/screens/Splash'
import StudentDashboard from './StudentSide/drawer/StudentDashboard'
import { createStackNavigator } from '@react-navigation/stack'
// import DateSheet from './StudentSide/screens/DateSheet'
import StudentResult from './StudentSide/screens/examination/StudentResult'
import StudentSemesterResult from './StudentSide/screens/examination/StudentSemesterResult'
import { StudentContext } from './context/StudentContext'
import PublicScreen from './PublicScreen'
import AboutUniversity from './PublicScreens/AboutUniversity'
import LifeAtGKU from './PublicScreens/LifeAtGKU'
import AdmissionsScreen from './PublicScreens/AdmissionsScreen'
import ContactScreen from './PublicScreens/ContactScreen'
import DepartmentsScreen from './PublicScreens/DepartmentsScreen'
import WhyChooseGKU from './PublicScreens/WhyChooseGku'
import Category from './Category'
import StaffLogin from './StaffSide/StaffLogin'
// import Dashboard from './StaffSide/Common/HeaderTop'
import CgpaCalculator from './StudentSide/screens/examination/CgpaCalculator'
import HeaderTop from './StaffSide/Common/HeaderTop'
import RecentTransactions from './StudentSide/screens/fees/RecentTransactions'
import StudentAttendance from './StudentSide/screens/StudentAttendance'
// import StudentNotification from './StudentSide/screens/StudentNotification'
import StudentLibrary from './StudentSide/screens/library/StudentLibrary'
import StudentBooksIssued from './StudentSide/screens/library/StudentBooksIssued'
import ApplyLeaveForm from './StaffSide/Screens/ApplyLeaveForm'
import AllSubjectsSemWise from './StudentSide/screens/examination/AllSubjectsSemWise'
import LibraryBooks from './StaffSide/Screens/LibraryBooks'
import MovmentRegister from './StaffSide/Screens/MovmentRegister'
import StaffNotification from './StaffSide/Screens/StaffNotification'
import StaffProfile from './StaffSide/StaffProfile'
import Calendar from './StaffSide/Attendance/Calendar'
import MyForms from './StudentSide/screens/examination/MyForms'
import ViewLeave from './StaffSide/Leaves/ViewLeave'
import ViewLeaveFile from './StaffSide/Leaves/ViewLeaveFile'
import StudentFilledExamForm from './StudentSide/screens/examination/StudentFilledExamForm'
import EncryptedStorage from 'react-native-encrypted-storage'
import BooksFineDetails from './StudentSide/screens/library/BooksFineDetails'
// import StudentNoticeBoard from './StudentSide/screens/StudentNoticeBoard'
// import SideBar from './StaffSide/Common/SideBar'
// import MyService from './services/MyService'
import EachReceipt from './StudentSide/screens/fees/EachReceipt'
import ExamForm from './StudentSide/screens/examination/ExamForm'
import ExamFormPhd from './StudentSide/screens/examination/ExamFormPhd'
import ExamFormAgricultureDiploma from './StudentSide/screens/examination/ExamFormAgricultureDiploma'
import ReappearForm from './StudentSide/screens/examination/ReappearForm'
import ReappearFormAgricultureDiploma from './StudentSide/screens/examination/ReappearFormAgricultureDiploma'
import ReappearFormPhd from './StudentSide/screens/examination/ReappearFormPhd'
import ApplyIdCard from './StudentSide/screens/ApplyIdCard'
import ApplyBusPass from './StudentSide/screens/ApplyBusPass'
import ViewCorrectionRequest from './StudentSide/screens/profile/ViewCorrectionRequest'
import StaffEditProfile from './StaffSide/Screens/StaffEditProfile'
import AttandancePdf from './StaffSide/Screens/AttandancePdf'
import PasswordForgot from './StaffSide/Screens/PasswordForgot'
import ForgotPassword from './StudentSide/screens/ForgotPassword'
import StudentStudyMaterial from './StudentSide/screens/StudentStudyMaterial'
import StudentStudyMaterialPdf from './StudentSide/screens/StudentStudyMaterialPdf'
import StudentAssignments from './StudentSide/screens/StudentAssignments'
import StudentSyllabus from './StudentSide/screens/StudentSyllabus'
import StudentProfile from './StudentSide/BottomScreens/StudentProfile'
import StudentDetailsCorrection from './StudentSide/screens/profile/StudentDetailsCorrection'
import MovementRequest from './StaffSide/Movement/MovementRequest'
import MovementPending from './StaffSide/Movement/MyMovements/MovementPending'
import MyMovements from './StaffSide/Movement/MyMovements/MyMovements'
import SupervisorMovements from './StaffSide/Movement/SupervisorMovements/SupervisorMovements'
import MovementReschedule from './StaffSide/Movement/SupervisorMovements/MovementReschedule'
import TrackMovement from './StaffSide/Movement/TrackMovement'
import CheckMovements from './StaffSide/Movement/CheckMovements'
import CorrectionRequestFileView from './StudentSide/screens/profile/CorrectionRequestFileView'
import MyLeaves from './StaffSide/Leaves/MyLeaves/MyLeaves'
import SupervisorLeaves from './StaffSide/Leaves/SupervisorLeaves/SupervisorLeaves'
import ChangePassword from './StudentSide/screens/ChangePassword'
import FeePayment from './StudentSide/screens/fees/FeePayment'
import FeePaymentConfirmation from './StudentSide/screens/fees/FeePaymentConfirmation'
import ConfirmPayment from './StudentSide/screens/fees/ConfirmPayment'
import PayFeeScreen from './StudentSide/screens/fees/PayFeeScreen'
import PaymentSuccessScreen from './StudentSide/screens/fees/PaymentSuccessScreen'
import PaymentFailureScreen from './StudentSide/screens/fees/PaymentFailureScreen'
import Receipts from './StudentSide/screens/fees/Receipts'

import BookSearch from './StudentSide/screens/library/BookSearch'
import StudentGrievance from './StudentSide/screens/grievance/StudentGrievance'
import GrievanceForm from './StudentSide/screens/grievance/GrievanceForm'
import TrackGrievance from './StudentSide/screens/grievance/TrackGrievance'
// import PreRequisite from './StudentSide/screens/PreRequisite'
import StudentProfileUpdate from './StudentSide/screens/profile/StudentProfileUpdate'
import StudentElectricityBills from './StudentSide/screens/hostel/StudentElectricityBills'
import GrievanceAttachmentView from './StudentSide/screens/grievance/GrievanceAttachmentView'
import AdmitCard from './StudentSide/screens/examination/AdmitCards'
import EachAdmitCard from './StudentSide/screens/examination/EachAdmitCard'
// import VerifyModal from './StaffSide/components/VerifyModal'
import StaffTimeTable from './StaffSide/Screens/StaffTimeTable'
import StaffWeeklyTimeTable from './StaffSide/Screens/StaffWeeklyTimeTable'
import MarkAttendance from './StaffSide/Screens/MarkAttendance'
import MarkLectureAttendance from './StaffSide/Screens/MarkLectureAttendance'
import PendingAdmitCardData from './StudentSide/screens/examination/PendingAdmitCardData'
import MyCertificates from './StudentSide/screens/myCertificates/MyCertificates'
import CertificateViewer from './StudentSide/screens/myCertificates/CertificateViewer'
import Notice from './StudentSide/screens/notices/Notice'
import StudentLeaves from './StudentSide/screens/hostel/StudentLeaves'
import EachLeaveForward from './StaffSide/Leaves/SupervisorLeaves/EachLeaveForward'
import ApplyForDocuments from './StudentSide/screens/ApplyDocuments/ApplyForDocuments'
import ApplyDocumentsForm from './StudentSide/screens/ApplyDocuments/ApplyDocumentsForm'
import TrackApplyDocument from './StudentSide/screens/ApplyDocuments/TrackApplyDocument'
import TrackEachRequest from './StudentSide/screens/ApplyDocuments/TrackEachRequest'
import ViewAttachedDocument from './StudentSide/screens/ApplyDocuments/ViewAttachedDocument'
// import ConfirmDocumentPayment from './StudentSide/screens/ApplyDocuments/ConfirmDocumentPayment'
import ComplaintsMainScreen from './StaffSide/CompliantsManagement/ComplaintsMainScreen'
import LaunchCompaint from './StaffSide/CompliantsManagement/LaunchCompaint'
import AllComplaints from './StaffSide/CompliantsManagement/AllComplaints'
import AcceptAndCompleteComplaint from './StaffSide/CompliantsManagement/AcceptAndCompleteComplaint'
import AssignTaskEach from './StaffSide/CompliantsManagement/AssignTaskEach'
import SupervisorTasks from './StaffSide/CompliantsManagement/SupervisorTasks/SupervisorTasks'
import CompleteTaskScreen from './StaffSide/CompliantsManagement/CompleteTaskScreen'
import RejectTaskScreen from './StaffSide/CompliantsManagement/RejectTaskScreen'
import SupervisorRejectedTasks from './StaffSide/CompliantsManagement/SupervisorTasks/SupervisorRejectedTasks'
import OpenImage from './services/OpenImage'
import AccountsDashboard from './StaffSide/Accounts/AccountsDashboard'
import OpenPDF from './services/OpenPDF'
import CreateNotification from './StaffSide/Notifications/CreateNotification'
import MainNotification from './StaffSide/Notifications/MainNotification'
import StudentNotification from './StudentSide/screens/Notifications/StudentNotification'
import CreateNotificationMain from './StaffSide/Notifications/CreateNotification/CreateNotificationMain'
import AllChats from './StaffSide/ChatSystem/AllChats'
import ChatScreen from './StaffSide/ChatSystem/ChatScreen'
import NewChat from './StaffSide/ChatSystem/NewChat'
import ChatRoot from './StaffSide/ChatSystem/ChatRoot'
import FeedbackFrom from './StudentSide/screens/FeedbackFrom'
import Convocation from './StudentSide/screens/convocation/Convocation'
import ConvocationFeePay from './StudentSide/screens/convocation/ConvocationFeePay'
import MessagesRoot from './StudentSide/screens/messages/MessagesRoot'
import NoduesMain from './StaffSide/NoDues/NoduesMain'
import ApproveNodues from './StaffSide/NoDues/ApproveNodues'
import TrackNoDues from './StaffSide/NoDues/TrackNoDues'
import ScanqrScreen from './StaffSide/VerifyStudent/ScanqrScreen'
import NotificationDisplay from './StaffSide/Screens/NotificationDisplay'


const Stack = createStackNavigator()


const AppNavigator = () => {

  const { isLoggedin, userType, StaffIDNo, studentIDNo} = useContext(StudentContext)
  const checkSession = async () => {
    const session = await EncryptedStorage.getItem("user_session")
    return session
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          elevation: 2
        },
      }}>
        {
          !isLoggedin ?
            <>
              <Stack.Screen name='PublicScreen' component={PublicScreen} options={{ headerShown: false, title: "Back" }} />
              <Stack.Screen name='AboutUniversity' component={AboutUniversity} options={{ headerShown: true, title:'About University' }} />
              <Stack.Screen name='LifeAtGKU' component={LifeAtGKU} options={{ headerShown: true }} />
              <Stack.Screen name='Category' component={Category} options={{ headerShown: false }} />
              <Stack.Screen name='Admissions' component={AdmissionsScreen} options={{ headerShown: true }} />
              <Stack.Screen name='Streams' component={DepartmentsScreen} options={{ headerShown: true }} />
              <Stack.Screen name='Contact' component={ContactScreen} options={{ headerShown: true }} />
              <Stack.Screen name='Why-Choose-GKU' component={WhyChooseGKU} options={{ headerShown: true }} />
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='StaffLogin' component={StaffLogin} options={{ headerShown: false }} />
              <Stack.Screen name='PasswordForgot' component={PasswordForgot} options={{ headerShown: true, title: 'Forgot Password', }} />
              <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: true, title: 'Forgot Password', }} />
            </> :
            isLoggedin && userType == 'Student' ?
              <>
                <Stack.Screen name='StudentDashboard' component={StudentDashboard} options={{ headerShown: false, title: 'Dashboard' }} />
                <Stack.Screen name='Account' component={StudentProfile} options={{ headerShown: true, title: 'Profile' }} />
                <Stack.Screen name='StudentLibrary' component={StudentLibrary} options={{ headerShown: true, title: 'Library' }} />
                <Stack.Screen name='Notice' component={Notice} options={{ headerShown: true, title: "All Notices" }} />
                <Stack.Screen name='StudentBooksIssued' component={StudentBooksIssued} options={{ headerShown: true, title: 'Issued Books' }} />
                <Stack.Screen name='BooksFineDetails' component={BooksFineDetails} options={{ headerShown: true, title: 'Books Fine Details' }} />
                <Stack.Screen name='BookSearch' component={BookSearch} options={{ headerShown: true, title: "Search Books" }} />
                <Stack.Screen name='StudentGrievance' component={StudentGrievance} options={{ headerShown: true, title: "Student Grievance" }} />
                <Stack.Screen name='GrievanceForm' component={GrievanceForm} options={{ headerShown: true, title: "Grievance Form" }} />
                <Stack.Screen name='TrackGrievance' component={TrackGrievance} options={{ headerShown: true, title: "Track Grievance" }} />
                <Stack.Screen name='GrievanceRequestFile' component={GrievanceAttachmentView} options={{ headerShown: true, title: "Grievance File" }} />
                <Stack.Screen name='StudentElectricityBill' component={StudentElectricityBills} options={{ headerShown: true, title: "Electricity Bill" }} />
                <Stack.Screen name='StudentLeaves' component={StudentLeaves} options={{ headerShown: true, title: "Leaves" }} />
                <Stack.Screen name='StudentStudyMaterial' component={StudentStudyMaterial} options={{ headerShown: true, title: 'Study Material' }} />
                <Stack.Screen name='StudentStudyMaterialPdf' component={StudentStudyMaterialPdf} options={{ headerShown: true, title: "Study Material" }} />
                <Stack.Screen name='StudentSyllabus' component={StudentSyllabus} options={{ headerShown: true, title: 'Syllabus' }} />
                <Stack.Screen name='StudentAssignments' component={StudentAssignments} options={{ headerShown: true, title: 'Assignments' }} />
                <Stack.Screen name='Examination Form' component={ExamForm} options={{ headerShown: true, title: 'Examination Form' }} />
                <Stack.Screen name='ExaminationFormPhd' component={ExamFormPhd} options={{ headerShown: true, title: 'Exam Form' }} />
                <Stack.Screen name='ExamFormAgricultureDiploma' component={ExamFormAgricultureDiploma} options={{ headerShown: true, title: 'Exam Form' }} />
                <Stack.Screen name='Reappear Form' component={ReappearForm} options={{ headerShown: true }} />
                <Stack.Screen name='ReappearFormAgricultureDiploma' component={ReappearFormAgricultureDiploma} options={{ headerShown: true, title: "Reappear Form" }} />
                <Stack.Screen name='ReappearFormPhd' component={ReappearFormPhd} options={{ headerShown: true, title: "Reappear Form" }} />
                <Stack.Screen name='Result' component={StudentResult} options={{ headerShown: true, title: 'All Results' }} />
                <Stack.Screen name='AllSubjectsSemWise' component={AllSubjectsSemWise} options={{ headerShown: true, title: 'All Subjects' }} />
                <Stack.Screen name='MyForms' component={MyForms} options={{ headerShown: true, title: 'Previous Exam Forms' }} />
                <Stack.Screen name='StudentFilledExamForm' component={StudentFilledExamForm} options={{ headerShown: true, title: 'My Exam Forms' }} />
                <Stack.Screen name='CGPA Calculator' component={CgpaCalculator} options={{ headerShown: true }} />
                <Stack.Screen name='AdmitCard' component={AdmitCard} options={{ headerShown: true, title: "Admit Card" }} />
                <Stack.Screen name='FeePayment' component={FeePayment} options={{ headerShown: true, title: "Fees Payment" }} />
                <Stack.Screen name='paymentConfirmation' component={FeePaymentConfirmation} options={{ headerShown: true, title: "Payment Confirmation" }} />
                <Stack.Screen name='ConfirmPayment' component={ConfirmPayment} options={{ headerShown: true, title: "Confirm Payment" }} />
                <Stack.Screen name='PayFeeScreen' component={PayFeeScreen} options={{ headerShown: true, title: "Pay Fee" }} />
                <Stack.Screen name='PaymentSuccessScreen' component={PaymentSuccessScreen} options={{ headerShown: true, title: "Payment Success" }} />
                <Stack.Screen name='PaymentFailureScreen' component={PaymentFailureScreen} options={{ headerShown: true, title: "Payment Failed" }} />
                <Stack.Screen name='Receipts' component={Receipts} options={{ headerShown: true }} />
                <Stack.Screen name='RecentTransactions' component={RecentTransactions} options={{ headerShown: true }} />
                <Stack.Screen name='StudentProfileUpdate' component={StudentProfileUpdate} options={{ headerShown: true, title: "Student Profile Update" }} />
                <Stack.Screen name='StudentDetailsCorrection' component={StudentDetailsCorrection} options={{ headerShown: true, title: 'Details' }} />
                <Stack.Screen name='StudentAttendance' component={StudentAttendance} options={{ headerShown: true, title: 'Attendance' }} />
                <Stack.Screen name='ApplyForDocuments' component={ApplyForDocuments} options={{ headerShown: true, title: "Apply Documents" }} />
                <Stack.Screen name='ApplyDocumentsForm' component={ApplyDocumentsForm} options={{ headerShown: true, title: "Apply Documents Form" }} />
                <Stack.Screen name='TrackApplyDocument' component={TrackApplyDocument} options={{ headerShown: true, title: "Track Apply Document" }} />
                <Stack.Screen name='TrackEachRequest' component={TrackEachRequest} options={{ headerShown: true, title: "Track  Request" }} />
                <Stack.Screen name='ViewAttachedDocument' component={ViewAttachedDocument} options={{ headerShown: true, title: "Attached Document" }} />
                <Stack.Screen name='MyCertificates' component={MyCertificates} options={{ headerShown: true, title: "MyCertificates" }} />
                <Stack.Screen name='CertificateViewer' component={CertificateViewer} options={{ headerShown: true, title: "Certificate" }} />
                <Stack.Screen name='ViewAppeal' component={ViewCorrectionRequest} options={{ headerShown: true, title: 'View Appeal' }} />
                <Stack.Screen name='CorrectionRequestFileView' component={CorrectionRequestFileView} options={{ headerShown: false }} />
                <Stack.Screen name='ApplyIdCard' component={ApplyIdCard} options={{ headerShown: true, title: 'Apply Id Card' }} />
                <Stack.Screen name='ApplyBusPass' component={ApplyBusPass} options={{ headerShown: true, title: 'Apply Bus Pass' }} />
                <Stack.Screen name='PendingAdmitCardData' component={PendingAdmitCardData} options={{ headerShown: true, title: "Pending Admit Card" }} />
                <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: true, title: "Change Password" }} />
                <Stack.Screen name='StudentSemesterResult' component={StudentSemesterResult} options={{ headerShown: true, title: 'Result' }} />
                <Stack.Screen name='EachReceipt' component={EachReceipt} options={{ headerShown: true, title: 'Receipt' }} />
                <Stack.Screen name='EachAdmitCard' component={EachAdmitCard} options={{ headerShown: true, title: "Semester Admit Card" }} />
                <Stack.Screen name='StudentNotification' component={StudentNotification} options={{ headerShown: true, title: "Notifications" }} />
                <Stack.Screen name='FeedbackForm' component={FeedbackFrom} options={{ headerShown: false, title: "Feedback" }} />
                <Stack.Screen name='Convocation' component={Convocation} options={{ headerShown: true, title: "Convocation" }} />
                <Stack.Screen name='ConvocationFeePay' component={ConvocationFeePay} options={{ headerShown: true, title: "Fee pay for Convocation" }} />
                <Stack.Screen name="MessagesRoot" options={{ headerShown: false }}>
                  {() => <MessagesRoot studentIDNo={studentIDNo} />}
                </Stack.Screen>
                {/* <Stack.Screen name='DateSheet' component={DateSheet} options={{ headerShown: true, title: 'Date Sheet' }} />
              <Stack.Screen name='StudentNotification' component={StudentNotification} options={{ headerShown: true, title: 'Notifications' }}/>
              <Stack.Screen name='StudentNoticeBoard' component={StudentNoticeBoard} options={{ headerShown: true, title: 'Notice Board'}} />
              <Stack.Screen name='MyService' component={MyService} options={{ headerShown: true, title: 'MyService'}} />
              <Stack.Screen name='PreRequisite' component={PreRequisite} options={{ headerShown: true, title: "Pre Requisite Course"}}/>
              <Stack.Screen name='OTPVerification' component={VerifyModal} options={{ headerShown: true, title: "OTP Verification"}}/>
              <Stack.Screen name='ConfirmDocumentPayment' component={ConfirmDocumentPayment} options={{ headerShown: true, title: "Confirm Payment"}}/>
              <Stack.Screen name='OpenPDF' component={OpenPDF} options={{ headerShown: true, title: "View Document"}} /> */}
              </>
              :
              <>
                <Stack.Screen name='StaffDashboard' component={HeaderTop} options={{ headerShown: false, title: 'Dashboard' }} />
                <Stack.Screen name='StaffProfile' component={StaffProfile} options={{ headerShown: true, title: 'Profile' }} />
                <Stack.Screen name='MyLeaves' component={MyLeaves} options={{ headerShown: true, title: 'My Leaves' }} />
                <Stack.Screen name='ApplyLeaveForm' component={ApplyLeaveForm} options={{ headerShown: true, title: 'Apply Leave Form' }} />
                <Stack.Screen name='ViewLeave' component={ViewLeave} options={{ headerShown: true, title: ' View Leave' }} />
                <Stack.Screen name='ViewLeaveFile' component={ViewLeaveFile} options={{ headerShown: true, title: ' View File' }} />
                <Stack.Screen name='SupervisorLeaves' component={SupervisorLeaves} options={{ headerShown: true, title: 'Supervisor Leaves' }} />
                <Stack.Screen name='MyMovements' component={MyMovements} options={{ headerShown: true, title: 'My Movements' }} />
                <Stack.Screen name='SupervisorMovements' component={SupervisorMovements} options={{ headerShown: true, title: 'Supervisor Reports' }} />
                <Stack.Screen name='RescheduleMovement' component={MovementReschedule} options={{ headerShown: true, title: 'Reschedule' }} />
                <Stack.Screen name='MovementRequest' component={MovementRequest} options={{ headerShown: true, title: 'Apply Movement Request' }} />
                <Stack.Screen name='MovementPending' component={MovementPending} options={{ headerShown: true, title: 'Pending Movenment' }} />
                <Stack.Screen name='CheckMovements' component={CheckMovements} options={{ headerShown: true, title: 'Check Movements' }} />
                <Stack.Screen name='LibraryBooks' component={LibraryBooks} options={{ headerShown: true, title: 'Issued Books' }} />
                <Stack.Screen name='StaffNotification' component={StaffNotification} options={{ headerShown: true, title: 'Notification' }} />
                <Stack.Screen name='Calendar' component={Calendar} options={{ headerShown: true, title: ' Calendar' }} />
                <Stack.Screen name='AttandancepdfDownload' component={AttandancePdf} options={{ headerShown: true, title: 'Download Summary Report' }} />
                <Stack.Screen name='StaffTimeTable' component={StaffTimeTable} options={{ headerShown: true, title: "Today Time Table" }} />
                <Stack.Screen name='AccountsDashboard' component={AccountsDashboard} options={{ headerShown: true, title: "Accounts" }} />
                <Stack.Screen name='StaffProfileEdit' component={StaffEditProfile} options={{ headerShown: true, title: 'Update Profile' }} />
                <Stack.Screen name='StaffWeeklyTimeTable' component={StaffWeeklyTimeTable} options={{ headerShown: true, title: "Weekly Time Table" }} />
                <Stack.Screen name='TrackMovement' component={TrackMovement} options={{ headerShown: true, title: 'Track Movement' }} />
                <Stack.Screen name='MarkAttendance' component={MarkAttendance} options={{ headerShown: true, title: "Mark Attendance" }} />
                <Stack.Screen name='MarkLectureAttendance' component={MarkLectureAttendance} options={{ headerShown: true, title: "Mark Lecture Attendance" }} />
                <Stack.Screen name='MovmentRegister' component={MovmentRegister} options={{ headerShown: true, title: 'Movment Register' }} />
                <Stack.Screen name='EachLeaveForward' component={EachLeaveForward} options={{ headerShown: true, title: "Leave Confirmation" }} />
                <Stack.Screen name='ComplaintsMainScreen' component={ComplaintsMainScreen} options={{ headerShown: true, title: "Complaints" }} />
                <Stack.Screen name='LaunchCompaint' component={LaunchCompaint} options={{ headerShown: true, title: "Add Compaint" }} />
                <Stack.Screen name='AllComplaints' component={AllComplaints} options={{ headerShown: true, title: "My Complaints" }} />
                <Stack.Screen name='AcceptAndCompleteComplaint' component={AcceptAndCompleteComplaint} options={{ headerShown: true, title: "Work on Complaint" }} />
                <Stack.Screen name='AssignTaskEach' component={AssignTaskEach} options={{ headerShown: true, title: "Assign Each Task" }} />
                <Stack.Screen name='SupervisorTasks' component={SupervisorTasks} options={{ headerShown: true, title: "Supervisor Tasks" }} />
                <Stack.Screen name='CompleteTaskScreen' component={CompleteTaskScreen} options={{ headerShown: true, title: "Complete Task" }} />
                <Stack.Screen name='RejectTaskScreen' component={RejectTaskScreen} options={{ headerShown: true, title: "Reject Task" }} />
                <Stack.Screen name='SupervisorRejectedTasks' component={SupervisorRejectedTasks} options={{ headerShown: true, title: "Rejected Tasks" }} />
                <Stack.Screen name='OpenImage' component={OpenImage} options={{ headerShown: true, title: "View Image" }} />
                <Stack.Screen name='OpenPDF' component={OpenPDF} options={{ headerShown: true, title: "View Document" }} />
                <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: true, title: "Change Password" }} />
                <Stack.Screen name='CreateNotifiaction' component={CreateNotification} options={{ headerShown: true, title: "Send Notice" }} />
                <Stack.Screen name='Notice' component={MainNotification} options={{ headerShown: true, title: "Notifications" }} />
                <Stack.Screen name='CreateNotice' component={CreateNotificationMain} options={{ headerShown: true, title: "Create Notice" }} />
                <Stack.Screen name="AllChats" options={{ headerShown: false }}>
                  {() => <ChatRoot StaffIDNo={StaffIDNo} />}
                </Stack.Screen>
                <Stack.Screen name='NoduesMain' component={NoduesMain} options={{ headerShown: true, title: "No Dues"}} />
                <Stack.Screen name='ApproveNodues' component={ApproveNodues} options={{ headerShown: true, title: "Approve No Dues"}} />
                <Stack.Screen name='TrackNoDues' component={TrackNoDues} options={{ headerShown: true, title: "Track No Dues"}} />
                <Stack.Screen name='ScanqrScreen' component={ScanqrScreen} options={{ headerShown: true, title: "Verify Student"}} />
                <Stack.Screen name='NotificationDisplay' component={NotificationDisplay} options={{ headerShown: true, title: "Notification View"}} />

                {/* <Stack.Screen name='AllChats' component={AllChats} options={{ headerShown: true, title: "Chats"}} />
              <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false, title: "Chat"}} />
              <Stack.Screen name='NewChat' component={NewChat} options={{ headerShown: true, title: "NewChat"}} /> */}
                {/*
              <Stack.Screen name='SideBar' component={SideBar} options={{headerShown:true, title:'Menu',}}/>
              */}
              </>
        }

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator