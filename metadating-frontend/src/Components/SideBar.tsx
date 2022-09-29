import { Component } from "react";
import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';

const SideBar = () => {
  return (
    <div className="fixed top-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg">


        <SideBarIcon icon={<FaFire size="48" />} />
    </div>
  );
};

type Icon = {
    icon:any
}

const SideBarIcon = ({ icon } : Icon)  => (
    <div className="sidebar-icon m-2">
        {icon}
    </div>
)

export default SideBar;
