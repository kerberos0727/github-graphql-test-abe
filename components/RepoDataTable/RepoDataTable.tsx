import React, { Fragment } from 'react';
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { faStar as f_star} from '@fortawesome/free-solid-svg-icons';
import { faStar as e_Star } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { gql } from "@apollo/client";
import { useMutation  } from "@apollo/client";

export const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
        starrable {
            id
            viewerHasStarred
            stargazers {
                totalCount
            }
        }
    }
  }
`;

const UNSTAR_REPOSITORY = gql`
mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
        starrable {
            id
            viewerHasStarred
            stargazers {
                totalCount
            }
        }
    }
}
`;

const TextField = styled.input`
	height: 40px;
	width: 250px;
	border-radius: 3px;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;
	&:hover {
		cursor: pointer;
	}
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>  
		<TextField 
			id="search"
			type="text"
			placeholder="Search..."
			aria-label="Search Input"
			value={filterText}
			onChange={onFilter}
		/>
	</>
);



function RepoDataTable ({repoDatas}) {
    console.log("repository datas", repoDatas);
    let rowDatas = [];
    const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
    repoDatas.edges.map( node => {
        let createform = new Date(node.node.createdAt).toLocaleString('en-US', options);
        var updatedDate = new Date(node.node.updatedAt);
        var today       = new Date();
        let dif_In_Time = (today.getTime() - updatedDate.getTime()) / (1000 * 3600);
        let passedUpdateTime = "";
        if (dif_In_Time < 24) {
            //time
            if (Math.round(dif_In_Time) === 1) {
                passedUpdateTime = "1 hour ago";
            } else {
                passedUpdateTime = Math.round(dif_In_Time) + " hours ago";
            }
        } else if (dif_In_Time < 24 * 30) {
            //day
            if (Math.round(dif_In_Time / 24) === 1) {
                passedUpdateTime = "1 day ago";
            } else {
                passedUpdateTime = Math.round(dif_In_Time / 24) + " days ago";
            }
        } else if (dif_In_Time < 24 * 365) {
            //month
            if (Math.round(dif_In_Time / (24 * 30)) === 1) {
                passedUpdateTime = "1 month ago";
            } else {
                passedUpdateTime = Math.round(dif_In_Time / (24 * 30)) + " months ago";
            }
        } else if (dif_In_Time < 24 * 365 * 2) {
            if (Math.round(dif_In_Time / (24 * 30)) === 12) {
                passedUpdateTime = "1 yesr ago";
            } else {
                passedUpdateTime = Math.round(dif_In_Time / (24 * 30)) + " months ago";
            }
        } else {
            passedUpdateTime = Math.round(dif_In_Time / (24 * 365)) + " years ago";
        }
        let eachData = {
            id          :   node.node.id,
            name        :   node.node.name,
            owner       :   node.node.owner.login,
            create      :   node.node.createdAt,
            createform  :   createform,
            update      :   node.node.updatedAt,
            updateDif   :   passedUpdateTime,
            stars       :   node.node.stargazers.totalCount,
            primaryLang :   node.node.primaryLanguage?node.node.primaryLanguage.name:"",
            url         :   node.node.url,
            doneStar    :   node.node.viewerHasStarred
        }
        rowDatas.push(eachData);
    })
    console.log(rowDatas);

    
    const col = [
        {
          name: "Name",
          selector: row => row.name.toLowerCase(),
          sortable: true,
          cell: row => <a className="hover:text-blue-500 text-base" href={row.url} target="_blank">{row.name}</a>,
          
        },
        {
          name: "Created Date",
          selector: row => row.create,
          sortable: true,
          cell: row => <span className="text-base">{row.createform}</span>,
        },
        {
          name: "Updated Date",
          selector: row => row.update,
          sortable: true,
          cell: row => <span className="text-base">{row.updateDif}</span>,
        },
        {
          name: "Primary Language",
          selector: row => row.primaryLang.toLowerCase(),
          sortable: true,
          cell: row => <span className="text-base">{row.primaryLang}</span>,
        },
        {
          name: "Stars",
          selector: row => row.stars,
          sortable: true,
          cell: row => {
            let starImg = row.doneStar?f_star:e_Star;
            return (
              <a className="hover:text-red-500 text-base cursor-pointer" onClick={onStar(row.id, row.doneStar)}><FontAwesomeIcon icon={starImg} className="text-sm"/> {row.stars}</a>
            );
          },
        },
    ]
    const onStar = (id, doneStar) => () => {
        if (doneStar) {
            removeStarage({ variables: { id: id}});
        } else {
            addStarage({ variables: { id: id }});
        }
    }
      
    const [addStarage, {}] = useMutation(STAR_REPOSITORY, {
        onCompleted(data) {
            console.log("immkm", data);
        }, onError(err) {

        }
    });
    const [removeStarage, {}] = useMutation(UNSTAR_REPOSITORY, {
        onCompleted(data) {
            // let temp = rowDatas.find(function(o){ return o.id===startedId });
            // temp.stars = temp.stars - 1;
        }, onError(err) {

        }
    });
    
	const [filterText, setFilterText] = React.useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = rowDatas.filter(
		item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) || item.owner && item.owner.toLowerCase().includes(filterText.toLowerCase()),
	);

	const subHeaderComponentMemo = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
            <Fragment>
                <span className="absolute left-px text-xl">Repositories</span>
                <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
            </Fragment>
			
		);
	}, [filterText, resetPaginationToggle]);
	return (
		<DataTable className="text-xl"
			// title="Contact List"
            noHeader
			columns={col}
			data={filteredItems}
			pagination
			paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
			subHeader
			subHeaderComponent={subHeaderComponentMemo}
			persistTableHead
            paginationRowsPerPageOptions={[5, 10]}
		/>
	);
};

export default RepoDataTable