import React from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Textarea from "@material-tailwind/react/Textarea";
import Radio from "@material-tailwind/react/Radio"
import { useState, useEffect  } from "react";
import { gql } from "@apollo/client";
import { useMutation  } from "@apollo/client";

  const REPOSITORY_FRAGMENT = gql`
  fragment repository on Repository {
    id
    name
    url
    createdAt
    updatedAt
    descriptionHTML
    primaryLanguage {
      name
    }
    owner {
      login
      url
    }
    stargazers {
      totalCount
    }
    viewerHasStarred
    watchers {
      totalCount
    }
    viewerSubscription
    
    defaultBranchRef {
      name
    }
    
  }
`;
  export const CREATE_REPOSITORY = gql`
    mutation ($repoName: String!, $repoVisibility: String!, $repoDes: String!) {
      createRepository(input:{name: $repoName, visibility: $repoVisibility, description: $repoDes}) {
        repository {
          id
          name
          url
          createdAt
          updatedAt
          descriptionHTML
          primaryLanguage {
            name
          }
          owner {
            login
            url
          }
          stargazers {
            totalCount
          }
          viewerHasStarred
          watchers {
            totalCount
          }
          viewerSubscription
          defaultBranchRef {
            name
          }
        }
      }
    }
  `;
 
function NewRepoModal({showModal, setShowModal}) {
  const [ repoName, setRepoName ] = useState("")
  const [ repoDes, setRepoDes ] = useState("")
  const [ repoPublic, setRepoPublic ] = useState("private")
  
  useEffect(() => {

  })
  const createNewRepo = () => {
    console.log("name", repoName);
    console.log("description", repoDes);
    console.log("isPublic", repoPublic);

    if (repoName === "") {
      alert("You have to enter repository name!");
      return;
    }

    updateNewRepo({ variables: { repoName: repoName, repoVisibility: repoPublic, repoDes: repoDes}});
    // getGitInfo();
  }

  const initializeAllFields = () => {
    setRepoName("");
    setRepoDes("");
    setRepoPublic('private');
    setShowModal(false);
  }
  
  const [updateNewRepo, {}] = useMutation(CREATE_REPOSITORY, {
    update: (cache, { data: { createRepository: addRepositoryData } }) => {
      initializeAllFields();
      let key = 'repositories({"first":100,"orderBy":{"direction":"DESC","field":"UPDATED_AT"}})';
      cache.modify({
        fields: {
          viewer: (exitRepoRef) => {
            // console.log("test2", exitRepoRef[key].edges);
            // console.log("test3-------", addRepositoryData.repository);
            const newRepoRef = cache.writeFragment({
                data: addRepositoryData.repository,
                fragment: REPOSITORY_FRAGMENT
            });
            // return [...exitRepoRef[key].edges, newRepoRef];
          }
        }
      });
    }
  });

  return (
    <Modal size="regular" active={showModal} toggler={initializeAllFields} className="-mt-96">
      <ModalHeader toggler={initializeAllFields}>
        Create a new repository
      </ModalHeader>
      <ModalBody>
        <label className="block text-gray-700 text-sm font-bold">
          Repository name
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 mt-1"
            value={repoName} onChange={e => { setRepoName(e.target.value); }}/>
        <div className="w-96 mt-5">
          <Textarea
              color="lightBlue"
              size="regular"
              outline={true}
              placeholder="Description (optional)"
              style={{height:60}}
              value={repoDes}
              onChange={e => { setRepoDes(e.target.value); }}
          />
        </div>
        
        <div className="mt-3  flex justify-start">
          <Radio
              color="lightBlue"
              text="Private"
              id="option-2"
              name="option"
              checked={repoPublic === 'private'}
              onChange={e => { setRepoPublic('private'); }}
          />
          <div className="w-10"></div>
          <Radio
                color="lightBlue"
                text="Public"
                id="option-1"
                name="option"
                checked={repoPublic === 'public'}
                onChange={e => { setRepoPublic('public'); }}
            />
        </div>
      </ModalBody>
      <ModalFooter>
          <Button
              color="red"
              buttonType="link"
              onClick={initializeAllFields}
              ripple="dark"
          >
              Close
          </Button>

          <Button
              color="green"
              onClick={createNewRepo}
              ripple="light"
          >
              Create
          </Button>
      </ModalFooter>
  </Modal>
  );
}

export default NewRepoModal;