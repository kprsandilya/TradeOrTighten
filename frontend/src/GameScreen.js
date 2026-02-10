import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import useWebSocket from './hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';

function GamemasterDashboard({ sendMessage }) {
    const triggerBonus = () => sendMessage({ type: 'gamemaster', fn: 'bonusPoints', args: ['player1', 50] });
    const triggerCrash = () => sendMessage({ type: 'gamemaster', fn: 'marketCrash', args: [] });
    const startTimer = () => sendMessage({ type: 'timer', action: 'start', duration: 600 });
    const pauseTimer = () => sendMessage({ type: 'timer', action: 'pause' });
    const resumeTimer = () => sendMessage({ type: 'timer', action: 'resume' });
    const resetTimer = () =>sendMessage({ type: 'timer', action: 'reset' });

    return (
        <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Gamemaster Dashboard</Typography>
        <Button variant="contained" sx={{ mr: 2 }} onClick={triggerBonus}>Give 50 Points</Button>
        <Button variant="contained" color="error" onClick={triggerCrash}>Market Crash</Button>
        <Button variant="contained" color="error" onClick={startTimer}>Start Timer</Button>
        <Button variant="contained" color="error" onClick={pauseTimer}>Pause Timer</Button>
        <Button variant="contained" color="error" onClick={resumeTimer}>Resume Timer</Button>
        <Button variant="contained" color="error" onClick={resetTimer}>Reset Timer</Button>
        </Box>
    );
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function Game() {
    const navigate = useNavigate();
    const { messages, sendMessage, connected } = useWebSocket('ws://localhost:8080');
    const [playerId] = useState(makeid(8));
    const gameState = messages[messages.length - 1];
    const timer = gameState?.timer;
    const [stage, setStage] = useState("spread");
    const [spread, setSpread] = useState(-1);

    const {
        seconds,
        minutes,
        pause,
        restart
        } = useTimer({
        expiryTimestamp: new Date(),
        autoStart: false
    });

    useEffect(() => {
        if (connected) {
            sendMessage({ type: 'join', playerId });
        }
    }, [connected]);

    useEffect(() => {
        if (!timer) return;

        // 🔁 RESET (explicit reset only)
        if (!timer.startedAt && !timer.isRunning && timer.duration === null) {
            pause();
            restart(new Date(), false);
            return;
        }

        // ⏸️ PAUSE (keep remaining time!)
        if (!timer.isRunning && timer.duration > 0) {
            pause();
            return;
        }

        // ▶️ START / RESUME
        if (timer.startedAt) {
            const expiry = new Date(
            timer.startedAt + timer.duration * 1000
            );
            restart(expiry, true);
        }
    }, [timer, pause, restart]);

    const leaveGame = () => {
        sendMessage({ type: 'leave', playerId });
        navigate('/')
    }
    const makeTrade = () => sendMessage({ type: 'trade', trade: { playerId, value: Math.floor(Math.random() * 100) } });

    const sendSpread = () => {
        sendMessage({ type: 'action', spread: spread });
        navigate('/')
    }

    return (
        <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Trade Game</Typography>
        <Button variant="contained" onClick={leaveGame} sx={{ mr: 2 }}>Leave Game</Button>
        <Button variant="contained" color="secondary" onClick={makeTrade}>Make Trade</Button>

        <Paper sx={{ mt: 4, p: 2, maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="h6">Game State Updates:</Typography>
            {messages.map((msg, i) => <pre key={i}>{JSON.stringify(msg, null, 2)}</pre>)}
        </Paper>

        <Typography variant="h4">
        {minutes}:{seconds.toString().padStart(2, '0')}
        </Typography>

        <GamemasterDashboard sendMessage={sendMessage} />
        </Box>
    );
}

export default Game;