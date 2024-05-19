import "./mode.css";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from "react-redux";
import { themeActions } from "../store/theme";

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DoneIcon from '@mui/icons-material/Done';

import ContrastIcon from '@mui/icons-material/Contrast';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const icons = [
    <LightModeIcon />,
    <DarkModeIcon />,
    <ContrastIcon />
];

const Mode = () => {
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [iconIndex, setIcon] = useState(0);
    const modeRef = useRef('light');
    
    const fetchSystemMode = useCallback(() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);
    
    const handleModeChange = useCallback((index) => {
        let selectedMode;
        if (index === 0) {
            selectedMode = "light";
        } else if (index === 1) {
            selectedMode = "dark";
        } else {
            selectedMode = "auto";
        }

        setIcon(index);
        const listItems = document.getElementsByClassName("modeItem");
        for (let i = 0; i < 3; i++) {
            listItems[i].classList.remove("activeMode");
        }
        listItems[index].classList.add("activeMode");

        if (selectedMode === "auto") {
            modeRef.current = fetchSystemMode();
        } else {
            modeRef.current = selectedMode;
        }
        
        dispatch(themeActions.setMode(modeRef.current));
        localStorage.setItem('theme', selectedMode); // Save to localStorage
        setIsVisible(false);
    }, [fetchSystemMode, dispatch]);

    useEffect(() => {
        const savedMode = localStorage.getItem('theme') || 'auto';
        let initialMode;
        if (savedMode === "auto") {
            initialMode = fetchSystemMode();
            setIcon(2);
        } else {
            initialMode = savedMode;
            setIcon(savedMode === 'light' ? 0 : 1);
        }

        modeRef.current = initialMode;
        dispatch(themeActions.setMode(initialMode));

        const handleSystemModeChange = (e) => {
            if (localStorage.getItem('theme') === "auto") {
                const newMode = e.matches ? 'dark' : 'light';
                modeRef.current = newMode;
                dispatch(themeActions.setMode(newMode));
            }
        };

        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', handleSystemModeChange);

        return () => {
            darkModeMediaQuery.removeEventListener('change', handleSystemModeChange);
        };
    }, [fetchSystemMode, dispatch]);

    const handleDropdown = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div className="theme">
            <ul className="dropdown" style={{ display: isVisible ? "block" : "none" }}>
                <li className="modeItem" onClick={() => handleModeChange(0)}>
                    <LightModeIcon />
                    Light
                    <DoneIcon style={{ color: iconIndex === 0 ? "inherit" : "transparent" }} />
                </li>
                <li className="modeItem" onClick={() => handleModeChange(1)}>
                    <DarkModeIcon />
                    Dark
                    <DoneIcon style={{ color: iconIndex === 1 ? "inherit" : "transparent" }} />
                </li>
                <li className="modeItem" onClick={() => handleModeChange(2)}>
                    <ContrastIcon />
                    Auto
                    <DoneIcon style={{ color: iconIndex === 2 ? "inherit" : "transparent" }} />
                </li>
            </ul>
            <div className="modeBtn">
                <button onClick={handleDropdown}>
                    {icons[iconIndex]}
                    <ArrowDropUpIcon />
                </button>
            </div>
        </div>
    );
};

export default Mode;
