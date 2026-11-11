import React, { useState, useRef, useEffect } from 'react';
import { playKeyboardClack, playDetectorBeep, playPdaClick } from '../../utils/audio';
import { UserProfile, Language } from '../../types/pda';

interface BashTerminalProps {
  profile: UserProfile;
  currentRadiation: number;
  onExitToPda: () => void;
  lang: Language;
}

export const BashTerminal: React.FC<BashTerminalProps> = ({
  profile,
  currentRadiation,
  onExitToPda,
  lang
}) => {
  const [history, setHistory] = useState<string[]>([
    'Z-OS (Kernel 6.9.1-stalker-rt) Tactical Linux Shell',
    'Type "help" for a list of tactical PDA commands or "pda" to return to launcher.',
    ''
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) {
      setHistory(prev => [...prev, `${profile.callsign.toLowerCase()}@pda-os:~$ `]);
      return;
    }

    setCmdHistory(prev => [...prev, cmd]);
    setHistoryIdx(-1);

    const promptLine = `${profile.callsign.toLowerCase()}@pda-os:~$ ${cmd}`;
    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    let output: string[] = [];

    switch (mainCmd) {
      case 'help':
        output = [
          'Tactical Linux Shell Commands:',
          '  help         - Show this command reference',
          '  neofetch     - Display Stalker PDA Linux system specifications',
          '  rad-scan     - Perform real-time radiation & anomalous field sweep',
          '  ls           - List files in current directory',
          '  cat <file>   - Read contents of file (e.g. cat stalker.log)',
          '  whoami       - Display current stalker identity & credentials',
          '  ping <host>  - Ping Zone radio relay network (e.g. ping cnpp.zone)',
          '  top          - Display running PDA system processes & telemetry',
          '  clear        - Clear the terminal screen',
          '  pda / exit   - Minimize desktop and return to PDA launcher'
        ];
        break;

      case 'neofetch':
        output = [
          '   ███████████        skif@stalker-pda-zOS',
          '  ███       ███       -------------------',
          '  ███   ☢   ███       OS: Z-OS 2.0.4 Linux x86_64 Tactical',
          '   ███████████        Host: MALIK-4 Military Handheld PDA',
          '      █████           Kernel: 6.9.1-stalker-rt',
          '     ██   ██          Uptime: 4 days, 18 hours, 32 mins',
          '    ██     ██         Packages: 742 (apk)',
          '   ██       ██        Shell: bash 5.2.26',
          '                      Terminal: /dev/ttyS0 Tactical CRT',
          '                      CPU: Arm Cortex-A78 Quad-Core @ 2.4GHz',
          '                      Memory: 1420MiB / 4096MiB (34%)',
          '                      Radiation Sensor: G-M Tube Veles-4 [Active]',
          '                      Faction Encryption: ' + profile.faction.toUpperCase()
        ];
        break;

      case 'rad-scan':
        playDetectorBeep(2100);
        output = [
          '[+] INITIATING GEIGER-MÜLLER RADIATION SCAN...',
          `[-] Sensor Dose Rate: ${currentRadiation.toFixed(2)} μSv/h`,
          `[-] Accumulated Dose: ${profile.radiationDose} mSv`,
          `[-] Contamination Status: ${currentRadiation > 50 ? 'CRITICAL HAZARD - EVACUATE' : currentRadiation > 1.5 ? 'ELEVATED - USE ANTIRAD' : 'NOMINAL BACKGROUND'}`,
          `[-] Nearest Anomaly Signature: 180m Bearing 042°`
        ];
        break;

      case 'ls':
        output = [
          'artifacts.db   coordinates.gpx   notes/   radio_keys.pem   stalker.log   weapons.cfg'
        ];
        break;

      case 'cat':
        if (args[1] === 'stalker.log') {
          output = [
            '2024-11-10 03:14:22 [INFO] Radio frequency 142.85 MHz synchronized.',
            '2024-11-10 03:18:05 [WARN] High gamma radiation spike recorded at CNPP perimeter.',
            '2024-11-10 03:22:40 [AUTH] Callsign validated: ' + profile.callsign + ' (' + profile.faction + ')',
            '2024-11-10 03:25:11 [INFO] GPS constellation locked: 12 satellites.'
          ];
        } else if (args[1] === 'artifacts.db') {
          output = [
            'ARTIFACT LOG ENTRY #402:',
            '  - Jellyfish: Gravitational absorption field, +12% ballistic defense',
            '  - Flame: High thermal generation, +4 HP/sec regeneration',
            '  - Flash: Electro-kinetic discharge storage, +25% stamina'
          ];
        } else if (args[1] === 'radio_keys.pem') {
          output = [
            '-----BEGIN ENCRYPTED STALKER PDA KEY-----',
            'MIIEowIBAAKCAQEA3fO9m3X...[CLASSIFIED SIRCAA ENCRYPTION]...',
            '-----END ENCRYPTED STALKER PDA KEY-----'
          ];
        } else {
          output = [`cat: ${args[1] || ''}: No such file or directory`];
        }
        break;

      case 'whoami':
        output = [
          `Callsign: ${profile.callsign}`,
          `ID Passport: ${profile.idNumber}`,
          `Faction: ${profile.faction}`,
          `Rank: ${profile.rank}`,
          `Reputation: +${profile.reputation}`,
          `Coupons: ${profile.coupons}`
        ];
        break;

      case 'ping':
        const host = args[1] || 'cnpp.zone';
        output = [
          `PING ${host} (10.42.0.1) 56(84) bytes of data.`,
          `64 bytes from 10.42.0.1: icmp_seq=1 ttl=54 time=14.2 ms`,
          `64 bytes from 10.42.0.1: icmp_seq=2 ttl=54 time=12.8 ms`,
          `64 bytes from 10.42.0.1: icmp_seq=3 ttl=54 time=13.6 ms`,
          `--- ${host} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`
        ];
        break;

      case 'top':
        output = [
          'top - 11:42:00 up 4 days, 1 user,  load average: 0.18, 0.22, 0.15',
          'Tasks: 42 total, 1 running, 41 sleeping, 0 stopped',
          '%Cpu(s):  4.2 us,  2.1 sy,  0.0 ni, 93.7 id',
          'MiB Mem :   4096.0 total,   2676.0 free,   1420.0 used',
          '',
          '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
          '  104 skif      20   0  245890  68240  42100 S   3.2   1.6   0:42.12 pda-launcher',
          '  219 skif      20   0  182300  45120  31400 S   1.8   1.1   0:18.05 geiger-daemon',
          '  340 skif      20   0   42100  12400   8200 S   0.5   0.3   0:04.10 radio-scanner'
        ];
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'pda':
      case 'exit':
        playPdaClick();
        onExitToPda();
        return;

      default:
        output = [`bash: ${mainCmd}: command not found. Type "help" for assistance.`];
        break;
    }

    setHistory(prev => [...prev, promptLine, ...output, '']);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeyboardClack();

    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInputVal(cmdHistory[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="w-full h-full bg-[#0a0c10] text-[#a3e635] font-mono text-xs p-4 overflow-y-auto select-text flex flex-col cursor-text"
    >
      <div className="flex-1 space-y-1">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}

        <div className="flex items-center gap-1.5 text-white">
          <span className="text-[#38bdf8]">{profile.callsign.toLowerCase()}@pda-os</span>
          <span className="text-gray-400">:</span>
          <span className="text-[#f59e0b]">~</span>
          <span className="text-gray-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-[#a3e635] font-mono focus:outline-hidden caret-white"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
