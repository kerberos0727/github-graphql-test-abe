import { ReactElement, useEffect, useState } from 'react'
import React, {Fragment} from 'react';
import { faBuilding, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RepoDataTable from "../../components/RepoDataTable/RepoDataTable"
import { useLazyQuery, useQuery } from "@apollo/client";
import GET_GIT_INFO from '../api/query'
import {connect} from 'react-redux';
import NewRepoModal from "../../components/Modals/NewRepoModal"


function Repositories({gitData}): ReactElement{
    const { loading, error, data } = useQuery(GET_GIT_INFO);
    // console.log("1111111111111", globalApolloClient.cache);
    console.log("--------------");
    console.log(data);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        
    })
    return(
        <div className = "bg-gray-200 h-screen overflow-hidden p-3 flex justify-start">
            {data &&
                <Fragment>
                    <div className="bg-white rounded w-72 shadow hover:shadow-md flex flex-col p-7 overflow-auto">
                        <img className="w-56 h-56 rounded-full shadow-lg" src={data.viewer.avatarUrl}/>
                        {data.viewer.name && <p className="text-xl mt-5 text-blue-darker">{data.viewer.name}</p>}
                        <p className="font-bold text-xl mt-0 text-blue-darker">{data.viewer.login}</p>
                        {data.viewer.bio&&<p className="text-base mt-2 text-blue-darker">
                            {data.viewer.bio}
                        </p>}
                        {data.viewer.company && 
                            <div className="flex justify-start mt-3" >
                                <FontAwesomeIcon icon={faBuilding} className="text-sm mt-1.5"/>
                                <p className="text-base ml-2 truncate">{data.viewer.company}</p>
                            </div>
                        }
                        {data.viewer.location&&
                            <div className="flex justify-start" >
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm mt-1.5"/>
                                <p className="text-base ml-2 truncate">{data.viewer.location}</p>
                            </div>
                        }
                        {/* <div className="flex justify-start" >
                            <FontAwesomeIcon icon={faLink} className="text-sm mt-1.5"/>
                            <p className="text-base ml-2 truncate">website</p>
                        </div>
                        <div className="flex justify-start" >
                            <FontAwesomeIcon icon={faTwitter} className="text-sm mt-1.5"/>
                            <p className="text-base ml-2 truncate">Twitter</p>
                        </div> */}
                        {/* <div className="flex justify-start" >
                            <FontAwesomeIcon icon={faUserClock} className="text-sm mt-1.5"/>
                            <p className="text-base ml-2 truncate">created date</p>
                        </div> */}
                        {/* e => { setShowModal(true); } */}
                        <div className="flex justify-center mt-10">
                            <button className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                onClick={e => { setShowModal(true); }}>New repository</button>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow hover:shadow-md flex-1 flex-col p-7 ml-10 overflow-auto">
                        <RepoDataTable repoDatas={data.viewer.repositories}/>
                    </div>
                    <NewRepoModal showModal={showModal} setShowModal={setShowModal}></NewRepoModal>
                </Fragment>
            }
        </div>
    );
} 

const mapStateToProps = state => ({
    gitData: state.counter.gitData
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Repositories);