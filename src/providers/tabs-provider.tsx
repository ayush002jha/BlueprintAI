"use client";
import {  PropsWithChildren, createContext, useContext, useState } from "react";

const TabContext = createContext({
    selectedTab:"",
    updateSelectedTab: (Tab:string)=>{},
})

const TabProvider = ({children}:PropsWithChildren)=>{
    const [selectedTab, setSelectedTab] = useState("Home");

    const updateSelectedTab = (Tab:string)=>{
        setSelectedTab(Tab);
    }


    return <TabContext.Provider value={{selectedTab,updateSelectedTab }}>
        {children}
    </TabContext.Provider>


}



export default TabProvider

export const useTab = ()=>useContext(TabContext)