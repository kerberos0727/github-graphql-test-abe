import GET_GIT_INFO from '../api/query'
import { useLazyQuery  } from "@apollo/client";
import { useState, useEffect  } from "react";
import {initApolloClient} from '../api/apollo-client'
import {connect} from 'react-redux';
import { useRouter } from 'next/router'
import {save_git_data} from '../../redux/actions/counterActions';
import React from 'react';

function LoginPage({client, setClient, saveData}){  
    useEffect(() => {
    })
    const router = useRouter()
    // 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
    const [ gitToken, setToken ] = useState("")
    const onKeyToken = (event) => {
        if(event.key === 'Enter'){
            onSignIn();
        }
    }

    const onSignIn = () => {
        if (gitToken === '') {
            alert('Please Enter Github Token');
            return;
        }
        setClient(initApolloClient(gitToken))
        loadGitInfo();
        
        
    }
    const [loadGitInfo, { loading}] = useLazyQuery(GET_GIT_INFO, {
        onCompleted(data) {
            console.log('invoked onCompleted', data);
            localStorage.setItem('apollo-client', gitToken);          
            saveData(data);
            router.push('/repositories')
        },
        onError(err) {
          console.log('onerror', err);
          if (err) {
                if (err.networkError.name === 'ServerError')
                {
                    alert('Your token is incorrect.');
                } else {
                    alert('Please check your network.');
                }
            } 
        },
      });
    if (loading) return <p className="text-center mt-80 text-2xl">Loading ...</p>;

    return(
        <div className="bg-gray-200 h-screen overflow-hidden px-3 pt-64 flex justify-center">
            
            <div className="w-full max-w-lg">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Token
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            id="username" type="text" placeholder="Enter Github Token" value={gitToken} onChange={e => { setToken(e.target.value); }} onKeyDown={onKeyToken}/>
                    </div>
                    <div className="flex items-center justify-end">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={onSignIn} value='client'>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 

const mapDispatchToProps = {
    saveData: save_git_data
};

export default connect(null, mapDispatchToProps)(LoginPage);
// onClick={() => onSignIn1()