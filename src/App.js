import React, {useEffect, useState} from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
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
        console.log(teamData);
    }

    const handle_change_number = (event) => {
        setNewTeam(event.target.value);
    }

    const handle_change_nick = (event) => {
        setNewTeamNick(event.target.value);
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

    const [teams, setTeams] = useState([{'15-3316': 'HBI'}]);
    const [teamData, setTeamData] = useState({});
    const [teamRank, setRankData] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(0);
    const colors = ['#2563EB','#9333EA','#F97316','#10b981'];

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
            console.log(new_results);
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
                    <div onClick={() => setCurrentTeam(index)} className='d-card'>
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
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong>{teamRank[currentTeam]['DivisionRank']}</strong></div><div style={{'fontSize': '20px'}}>/{teamRank[currentTeam]['TotalTeamsDivision']}</div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['DivisionPercentile']}th Percentile</div>
                            </div>
                            <div className='d-board-tier'>
                                <div className='d-board-standing-cat'><strong>Tier</strong></div>
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong>{teamRank[currentTeam]['TierRank']}</strong></div><div style={{'fontSize': '20px'}}>/{teamRank[currentTeam]['TotalTeamsTier']}</div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['TierPercentile']}th Percentile</div>
                            </div>
                            <div className='d-board-state'>
                                <div className='d-board-standing-cat'><strong>State</strong></div>
                                <div className='d-board-standing-place'><div style={{'fontSize': '30px'}}><strong>{teamRank[currentTeam]['StateRank']}</strong></div><div style={{'fontSize': '20px'}}>/{teamRank[currentTeam]['TotalTeamsState']}</div></div>
                                <div className='d-board-standing-perc'>{teamRank[currentTeam]['StatePercentile']}th Percentile</div>
                            </div>

                        </div>
                    </div>
                    <div className='d-board-body'>
                        <LineChart width={800} height={450} data={teamData[teamRank[currentTeam]['TeamNumber']]['history']}
                        margin={{ top: 40, right: 20, bottom: 5, left: 0 }}>
                            { teamData[teamRank[currentTeam]['TeamNumber']]['images'].map((image, index) => (
                                <Line type='monotone' dataKey={image['name']} dot={false} stroke={colors[index]} />
                            ))}
                            <XAxis dataKey={'clean_time'}/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                        </LineChart>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

export default App;
