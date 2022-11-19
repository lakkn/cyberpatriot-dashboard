import React, {useEffect, useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { HiOutlinePause, HiOutlinePlay, HiOutlinePlus, HiOutlineMinus, HiOutlineChevronDoubleRight, HiOutlineChevronDoubleLeft } from "react-icons/hi2";
import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    ResponsiveContainer
} from 'recharts';
import Timeout from 'smart-timeout';
import CountUp from 'react-countup';
import './App.css';
import './Dashboard.css';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useSearchParams,
    useLocation,
} from "react-router-dom";

const api_base_path = 'https://cyberpatriot-scraper.lakkn.workers.dev/'

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </Router>
        </div>
    );
}

function Home() {
    const [teamData, setTeamData] = useState([]);
    const [addPopUp, setAddPopUp] = useState(0);
    const [newTeam, setNewTeam] = useState('');
    const [newTeamNick, setNewTeamNick] = useState('');

    useEffect(() => {
        if(localStorage.getItem('teams') !== null){
            setTeamData(JSON.parse(localStorage.getItem('teams')));
        }
    }, [])

    const add_team = () => {
        var new_team = {};
        new_team[newTeam] = newTeamNick;
        teamData.push(new_team);
        setNewTeam('');
        setNewTeamNick('');
        setAddPopUp(0);
    }

    const show_add = () => {
        setAddPopUp(1);
    }

    const delete_team = (idx) => {
        var newTeams = [];
        for(var i = 0; i < teamData.length ; i++){
            if(i != idx){
                newTeams.push(teamData[i]);
            }
        }
        setTeamData(newTeams);
    }

    const handle_change_number = (event) => {
        setNewTeam(event.target.value);
    }

    const handle_change_nick = (event) => {
        if(event.target.value.length() < 17){
            setNewTeamNick(event.target.value);
        }
    }

    const build = () => {
        localStorage.setItem("teams", JSON.stringify(teamData));
        window.location.href = window.location.href + 'dashboard';
    }

    return (
        <div className="h-all">
            {addPopUp == 1 &&
            <div className="h-add">
                <div style={{'fontSize': '30px', 'marginBottom': '15px'}} className="h-title">Add Team</div>
                <div style={{'marginBottom': '10px'}}>Team ID</div>
                <input className="h-id-box" value={newTeam} onChange={handle_change_number} placeholder="15-0000" />
                <div style={{'marginBottom': '10px', 'marginTop': '20px'}}>Nickname</div>
                <input className="h-nick-box" value={newTeamNick} onChange={handle_change_nick} placeholder="Lorem Ipsum Dolor" />
                <div className="h-button-holder" style={{'marginTop': '25px'}} onClick={add_team}><div className="h-button">add</div></div>
            </div>
            }
            <div className="h-editor">
                <div className="h-title"><strong>CyberPatriot Dashboard Builder</strong></div>
                <table className="h-table">
                    <colgroup>
                        <col style={{'width': '100px'}}/>
                        <col style={{'width': '400px'}}/>
                        <col style={{'width': '100px'}}/>
                    </colgroup>
                    <thead className="h-head">
                        <tr>
                            <th><div>Team ID</div></th>
                            <th><div>Nickname</div></th>
                            <th><div></div></th>
                        </tr>
                    </thead>
                    <tbody className="h-body">
                        {teamData.map((team, idx) => (
                                <tr className="h-row">
                                    <td><div>{Object.keys(team)[0]}</div></td>
                                    <td><div>{team[Object.keys(team)[0]]}</div></td>
                                    <td style={{'color': '#DE1010', 'cursor': 'pointer'}}><div onClick={() => delete_team(idx)}>remove</div></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {teamData.length == 0 &&
                    <div className="h-no-team">
                    <i>no teams added</i>
                    </div>
                }
                <div className="h-button-holder">
                    <div onClick={show_add} className="h-button">add</div>
                    <div onClick={build} className="h-button">build</div>
                </div>
            </div>
        </div>
    );
}

function Dashboard() {

    const [teams, setTeams] = useState([]);
    const [teamData, setTeamData] = useState({})
//    const [teamData, setTeamData] = useState({
//    '15-3316': {
//        'images': [
//            {'name': 'Windows10', 'runtime': 330, 'score': 77, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Ubuntu', 'runtime': 330, 'score': 75, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Server', 'runtime': 330, 'score': 85, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Debian', 'runtime': 330, 'score': 85, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false}
//        ],
//        'history': [
//            {'Windows10': 0, 'Ubuntu': 0, 'Server': 0, 'Debian': 0, 'clean_time': '00:00'},
//            {'Windows10': 5, 'Ubuntu': 10, 'Server': 0, 'Debian': 0, 'clean_time': '00:05'},
//            {'Windows10': 9, 'Ubuntu': 20, 'Server': 0, 'Debian': 0, 'clean_time': '00:10'},
//            {'Windows10': 13, 'Ubuntu': 37, 'Server': 27, 'Debian': 10, 'clean_time': '00:15'},
//            {'Windows10': 14, 'Ubuntu': 43, 'Server': 30, 'Debian': 10, 'clean_time': '00:20'},
//            {'Windows10': 14, 'Ubuntu': 45, 'Server': 33, 'Debian': 10, 'clean_time': '00:25'},
//            {'Windows10': 19, 'Ubuntu': 45, 'Server': 40, 'Debian': 32, 'clean_time': '00:30'},
//            {'Windows10': 21, 'Ubuntu': 45, 'Server': 42, 'Debian': 32, 'clean_time': '00:35'},
//            {'Windows10': 23, 'Ubuntu': 50, 'Server': 44, 'Debian': 32, 'clean_time': '00:40'},
//            {'Windows10': 23, 'Ubuntu': 50, 'Server': 47, 'Debian': 32, 'clean_time': '00:45'},
//            {'Windows10': 19, 'Ubuntu': 69, 'Server': 50, 'Debian': 37, 'clean_time': '00:50'},
//            {'Windows10': 29, 'Ubuntu': 69, 'Server': 53, 'Debian': 42, 'clean_time': '00:55'},
//            {'Windows10': 34, 'Ubuntu': 69, 'Server': 59, 'Debian': 52, 'clean_time': '01:05'},
//            {'Windows10': 39, 'Ubuntu': 69, 'Server': 63, 'Debian': 58, 'clean_time': '01:10'},
//            {'Windows10': 42, 'Ubuntu': 75, 'Server': 66, 'Debian': 63, 'clean_time': '01:15'},
//            {'Windows10': 46, 'Ubuntu': 75, 'Server': 71, 'Debian': 70, 'clean_time': '01:20'},
//            {'Windows10': 54, 'Ubuntu': 75, 'Server': 76, 'Debian': 70, 'clean_time': '01:25'},
//            {'Windows10': 60, 'Ubuntu': 75, 'Server': 80, 'Debian': 70, 'clean_time': '01:30'},
//            {'Windows10': 77, 'Ubuntu': 75, 'Server': 85, 'Debian': 80, 'clean_time': '01:35'},
//        ]
//    },
//    '15-3318': {
//        'images': [
//            {'name': 'Windows10', 'runtime': 330, 'score': 55, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Ubuntu', 'runtime': 330, 'score': 65, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Server', 'runtime': 330, 'score': 57, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false},
//            {'name': 'Debian', 'runtime': 330, 'score': 52, 'issues': {'found': 20, 'remaining': 2}, 'penalties': 0, 'multiple': false, 'overtime': false}
//        ],
//        'history': [
//            {'Windows10': 0, 'Ubuntu': 0, 'Server': 0, 'Debian': 0, 'clean_time': '00:00'},
//            {'Windows10': 5, 'Ubuntu': 10, 'Server': 0, 'Debian': 0, 'clean_time': '00:05'},
//            {'Windows10': 9, 'Ubuntu': 20, 'Server': 0, 'Debian': 10, 'clean_time': '00:10'},
//            {'Windows10': 13, 'Ubuntu': 37, 'Server': 27, 'Debian': 15, 'clean_time': '00:15'},
//            {'Windows10': 14, 'Ubuntu': 43, 'Server': 30, 'Debian': 30, 'clean_time': '00:20'},
//            {'Windows10': 14, 'Ubuntu': 45, 'Server': 33, 'Debian': 30, 'clean_time': '00:25'},
//            {'Windows10': 19, 'Ubuntu': 45, 'Server': 40, 'Debian': 38, 'clean_time': '00:30'},
//            {'Windows10': 21, 'Ubuntu': 45, 'Server': 42, 'Debian': 38, 'clean_time': '00:35'},
//            {'Windows10': 23, 'Ubuntu': 50, 'Server': 44, 'Debian': 38, 'clean_time': '00:40'},
//            {'Windows10': 23, 'Ubuntu': 50, 'Server': 47, 'Debian': 43, 'clean_time': '00:45'},
//            {'Windows10': 19, 'Ubuntu': 69, 'Server': 50, 'Debian': 43, 'clean_time': '00:50'},
//            {'Windows10': 29, 'Ubuntu': 69, 'Server': 57, 'Debian': 43, 'clean_time': '00:55'},
//            {'Windows10': 34, 'Ubuntu': 69, 'Server': 57, 'Debian': 50, 'clean_time': '01:05'},
//            {'Windows10': 39, 'Ubuntu': 69, 'Server': 57, 'Debian': 48, 'clean_time': '01:10'},
//            {'Windows10': 42, 'Ubuntu': 75, 'Server': 57, 'Debian': 48, 'clean_time': '01:15'},
//            {'Windows10': 46, 'Ubuntu': 75, 'Server': 57, 'Debian': 50, 'clean_time': '01:20'},
//            {'Windows10': 54, 'Ubuntu': 75, 'Server': 57, 'Debian': 50, 'clean_time': '01:25'},
//            {'Windows10': 60, 'Ubuntu': 75, 'Server': 57, 'Debian': 50, 'clean_time': '01:30'},
//            {'Windows10': 55, 'Ubuntu': 65, 'Server': 57, 'Debian': 52, 'clean_time': '01:35'},
//        ]
//    },
//    });
    const [teamRank, setRankData] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(0);
    const previousTeam = useMemo(() => (currentTeam - 1 + teams.length) % teams.length, [teams, currentTeam]);
    const [timerLength, setTimerLength] = useState(10000);

    const [paused, setPaused] = useState(false);

    const progressRef = document.getElementsByClassName('d-board-bar')[0];
    const pauseIfPaused = useCallback(() => paused && Timeout.pause(timer), [paused]);

    const resetProgress = () => {
        if (progressRef) {
            progressRef.style.width = "0%";
            progressRef.style.opacity = "1";
        }
    };

    const timer = 'timer';

    const afterChange = useCallback(() => {
        Timeout.restart(timer, true);
        resetProgress();
        pauseIfPaused();
    }, [pauseIfPaused]);

    const nextTeam = useCallback(() => {
        setCurrentTeam((i) => (i + 1) % teams.length);
        afterChange();
    }, [afterChange, teams.length]);

    const prevTeam = useCallback(() => {
        setCurrentTeam((i) => (i - 1 + teams.length) % teams.length);
        afterChange();
    }, [afterChange, teams.length]);

    const easeInOutCubic = (x: number) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    useAnimationFrame(() => {
        if (!progressRef || Timeout.paused(timer)) return;
        const style = progressRef.style;
        const progress = (timerLength - Timeout.remaining(timer)) / timerLength;

        const start = Math.min(0.1, 750 / timerLength);
        const finish = Math.max(0.95, (timerLength - 500) / timerLength);

        if (progress < start) {
            resetProgress();
        } else if (progress > finish) {
            const localProgress = (progress - finish) / (1 - finish);
            style.width = "100%";
            style.opacity = `${1 - easeInOutCubic(localProgress)}`;
        } else {
            const localProgress = (progress - start) / (finish - start);
            style.width = `${localProgress * 100}%`;
            style.opacity = "1";
        }
    });

    useEffect(() => {
        setCurrentTeam((i) => (i % teams.length === 0 ? 0 : i));
        Timeout.instantiate(timer, nextTeam, timerLength);
        resetProgress();
        pauseIfPaused();

        return () => {
            Timeout.clear(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams.length, timerLength]);

    useEffect(() => {
        if (paused) {
            Timeout.pause(timer);
        } else {
            Timeout.resume(timer);
        }
    }, [paused]);

    const colors = ['#2563EB','#9333EA','#F97316','#10b981'];

    const setTeam = (id) => {
        setCurrentTeam(id);
    };

    useEffect(() => {
        const getData = async () => {
            setTeams(JSON.parse(localStorage.getItem('teams')));
            var teamList = JSON.parse(localStorage.getItem("teams"));
            var teamNums = [];
            var parsedNums = [];
            teamList.forEach(function(team){teamNums.push(Object.keys(team)[0]);parsedNums.push(Object.keys(team)[0].substring(3));});
            setTeams(teamList);
            if(teamList === 0) return;

            const res = await fetch('https://cyberpatriot-scoreboard.xcvr48.workers.dev/'+"info?teams="+teamNums.join(","));
            const res2 = await fetch('https://0tc8svpio2.execute-api.us-east-1.amazonaws.com/default/cyberpatriot-read',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({teams: parsedNums}),
            });
            if (!res.ok){
                return;
            };


            var results = JSON.parse(await res.text());
            var results2 = await res2.json();
            var new_results = results;
            Object.keys(results).map((teamnum) => (
                results[teamnum]['history'].map(function(piece, index){
                    Object.keys(piece['images']).map(function(image){
                        new_results[teamnum]['history'][index][image] = piece['images'][image];
                    })
                    new_results[teamnum]['history'][index]['clean_time'] = piece['time'].substring(11,16);
                })
            ))
            setRankData(results2['teams']);
            setTeamData(results);
        };

        getData();
        const interval = setInterval(getData, 60000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className='d-all'>
            <div className='d-left'>
                { teamRank.map((team, index) => (
                    <div onClick={() => setTeam(index)} className='d-card'>
                        <div className='d-card-head'>
                            <div className='d-card-num'>{team['TeamNumber']}</div>
                            <div className='d-card-name'>{teams[index][team['TeamNumber']]}</div>
                        </div>
                        <div className="d-card-body">
                            <div className="d-card-score">{team['ImageScore']}</div>
                            <div className="d-card-images">
                                { teamData[team['TeamNumber']]['images'].map((image, index) => (
                                    <div className='d-card-image'>
                                        <div className='d-card-playtime'>{Math.floor(image['runtime']/60)}:{image['runtime']%60}</div>
                                        <div>{image['score']}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='d-right'>
                { teamRank.length > 0 &&
                <div className='d-board'>
                    <div className='d-board-head'>
                        <div className='d-board-team'>
                            <div className='d-board-number'>{teamRank[currentTeam]['TeamNumber']}</div>
                            <div className='d-board-name'><strong>{teams[currentTeam][teamRank[currentTeam]['TeamNumber']]}</strong></div>
                        </div>
                        <div className='d-board-standing'>
                            <div className='d-board-rank'>
                                <div className='d-board-standing-cat'><strong>National</strong></div>
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong><CountUp end={teamRank[currentTeam]['DivisionRank']} duration={3} useEasing={true} /></strong></div><div style={{'fontSize': '20px'}}>/<CountUp end={teamRank[currentTeam]['TotalTeamsDivision']} duration={2} useEasing={true} /></div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['DivisionPercentile']}th Percentile</div>
                            </div>
                            <div className='d-board-tier'>
                                <div className='d-board-standing-cat'><strong>{teamRank[currentTeam]['Tier']}</strong></div>
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong><CountUp end={teamRank[currentTeam]['TierRank']} duration={3} useEasing={true} /></strong></div><div style={{'fontSize': '20px'}}>/<CountUp end={teamRank[currentTeam]['TotalTeamsTier']} duration={2} useEasing={true} /></div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['TierPercentile']}th Percentile</div>
                            </div>
                            <div className='d-board-state'>
                                <div className='d-board-standing-cat'><strong>State</strong> <div className='d-board-state-symbol'>{teamRank[currentTeam]['State']}</div></div>
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong><CountUp end={teamRank[currentTeam]['StateRank']} duration={3} useEasing={true} /></strong></div><div style={{'fontSize': '20px'}}>/<CountUp end={teamRank[currentTeam]['TotalTeamsState']} duration={2} useEasing={true} /></div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['StatePercentile']}th Percentile</div>
                            </div>

                        </div>
                    </div>
                    <div className='d-board-body'>
                        <div className='d-board-main'>
                            <div className='d-board-graph'>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={teamData[teamRank[currentTeam]['TeamNumber']]['history']}
                                margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                                    { teamData[teamRank[currentTeam]['TeamNumber']]['images'].map((image, index) => (
                                        <Line type='monotone' dataKey={image['name']} dot={false} stroke={colors[index]} strokeWidth={2} activeDot={{ r: 6 }} />
                                    ))}
                                    <XAxis dataKey={'clean_time'}/>
                                    <CartesianGrid strokeDasharray="6 6" />
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                </LineChart>
                            </ResponsiveContainer>
                            </div>
                            <div className="d-board-images">
                                { teamData[teamRank[currentTeam]['TeamNumber']]['images'].map((image, index) => (
                                    <div className='d-board-image-info'>
                                        <div className='d-board-image-name' style={{'color': colors[index]}}>{image['name']}</div>
                                        <div className='d-board-image-details'>
                                            <div className='d-board-image-score'>{image['score']}</div>
                                            <div className='d-board-image-vulns'>
                                                <div>{image['issues']['found']}/{image['issues']['found']+image['issues']['remaining']} Vulns Found</div>
                                                <div>{image['penalties']} Penalties Given</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='d-board-playback'>
                            <div className='d-board-pb-settings'>
                                <div className='d-board-pb-left'>
                                    <div className='d-board-pb-playpause-holder'>
                                        { paused
                                          ? <HiOutlinePlay onClick={() => setPaused(false)} className='d-board-pb-playpause' />
                                          : <HiOutlinePause onClick={() => setPaused(true)} className='d-board-pb-playpause' />
                                        }
                                    </div>
                                    <div className='d-board-pb-timer'>
                                        <HiOutlineMinus onClick={() => setTimerLength((i) => Math.max(i - 1000, 1000))} className='d-board-pb-plusminus' />
                                        {timerLength/1000}
                                        <HiOutlinePlus onClick={() => setTimerLength((i) => (i+1000))} className='d-board-pb-plusminus' />
                                    </div>
                                </div>
                                <div className='d-board-pb-right'>
                                    <div className='d-board-pb-prev' onClick={prevTeam}><HiOutlineChevronDoubleLeft/></div>
                                    <div className='d-board-pb-next' onClick={nextTeam}><HiOutlineChevronDoubleRight/></div>
                                </div>
                            </div>
                            <div className='d-board-bar'>
                                <motion.div
                                    className='d-board-bar2'
                                    style={{
                                        'backgroundImage': 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
                                        'backgroundColor': '#4158D0',
                                    }}
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

export default App;
