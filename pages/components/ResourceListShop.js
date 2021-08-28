
import React, {useContext, useState} from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
    Card,
    ResourceList,
    Stack,
    TextStyle,
    Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import AddMetafieldToShop from './AddMetafieldToShop';

// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// variations of a product can have different prices.
const GET_SHOP_WITH_METAFIELDS = gql`
    query getShopsWithMetafields {
        shop {
            id
            name
            description
            metafields(first:10) {
                edges {
                    node {
                        id
                        key
                        description
                        namespace
                        createdAt
                        value                        
                    }
                }
            }
        }
    }
`;


const ResourceListShop = () => {
    const context = useContext(Context);

    const [selectedItems, setSelectedItems]=useState([]);
    const [selectedNodes, setSelectedNodes]=useState({});

    return (
        // GraphQL query to retrieve products and their prices
        <Query query={GET_SHOP_WITH_METAFIELDS} variables={{ ids: store.get('ids') }}>
            {({ data, loading, error, refetch }) => {
                if (loading) return <div>{`Loading…`}</div>;
                if (error) return <div>{error.message}</div>;
                const nodesById = {};
                console.log(data);
                //data.nodes.forEach(node => nodesById[node.id] = node);

                return (
                    <>
                    <div>
                        {`Shop and metafields will be displayed here: `}
                        {JSON.stringify(data)}
                    </div>
                    </>
                );
            }}
        </Query>
        
    );
}

export default ResourceListShop;