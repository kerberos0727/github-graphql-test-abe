import { gql } from "@apollo/client";
import {graphql} from 'react-apollo';
import { GraphQLSchema } from 'graphql';

const { buildSchema } = require('graphql');

export const REPOSITORY_FRAGMENT = gql`
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
// languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
//   totalSize 
//   edges {
//     size
//     node {
//       name
//     }
//   }
// }

// object(expression: "master:") {
//   ... on Blob {
//     oid
//     byteSize
//     text
//   }
// }
// object(expression: "HEAD:") {
//   ... on Tree {
//     entries {
//       name
//       type
//       mode
      
//       object {
//         ... on Blob {
//           byteSize
//           text
//           isBinary
//         }
//       }
//     }
//   }
// }
const GET_GIT_INFO = gql`
  query($cursor: String) {
    viewer {
      ... on User {
        login
        name
        bio
        company
        location
        avatarUrl
        repositories(
          first: 100
          orderBy: {field:UPDATED_AT, direction: DESC}
          after: $cursor
        ) {
          edges {
            node {
              ...repository
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

export default GET_GIT_INFO;