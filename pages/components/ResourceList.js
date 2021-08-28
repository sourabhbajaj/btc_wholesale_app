
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
import ApplyRandomPrices from './AddMetafieldToShop';

// GraphQL query to retrieve products by IDs.
// The price field belongs to the variants object because
// variations of a product can have different prices.
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

const ResourceListWithProducts = () => {
    const context = useContext(Context);

    const [selectedItems, setSelectedItems]=useState([]);
    const [selectedNodes, setSelectedNodes]=useState({});

    return (
        // GraphQL query to retrieve products and their prices
        <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
            {({ data, loading, error, refetch }) => {
                if (loading) return <div>{`Loading…`}</div>;
                if (error) return <div>{error.message}</div>;
                const nodesById = {};
                data.nodes.forEach(node => nodesById[node.id] = node);

                return (
                    <>
                    <Card>
                        <ResourceList // Defines your resource list component
                            showHeader
                            resourceName={{ singular: 'Product', plural: 'Products' }}
                            items={data.nodes}
                            selectable
                            selectedItems={selectedItems}
                            onSelectionChange={selectedItems=>{
                                const selectedNodes = {};
                                selectedItems.forEach(item => selectedNodes[item] = nodesById[item]);
                                setSelectedNodes(selectedNodes);
                                setSelectedItems(selectedItems);
                                return selectedNodes;
                            }}
                            renderItem={item => {
                                const media = (
                                    <Thumbnail
                                        source={
                                            item.images.edges[0]
                                                ? item.images.edges[0].node.originalSrc
                                                : ''
                                        }
                                        alt={
                                            item.images.edges[0]
                                                ? item.images.edges[0].node.altText
                                                : ''
                                        }
                                    />
                                );
                                const price = item.variants.edges[0].node.price;
                                return (
                                    <ResourceList.Item
                                        id={item.id}
                                        media={media}
                                        accessibilityLabel={`View details for ${item.title}`}
                                        verticalAlignment="center"
                                        onClick={() => {
                                            let index = selectedItems.indexOf(item.id);
                                            const node = nodesById[item.id];
                                            if (index === -1) {
                                                selectedItems.push(item.id);
                                                selectedNodes[item.id] = node;
                                            } else {
                                                selectedItems.splice(index, 1);
                                                delete selectedNodes[item.id];
                                            }

                                            setSelectedNodes(selectedNodes);
                                            setSelectedItems(selectedItems);
                                        }}
                                    >
                                        <Stack alignment="center">
                                            <Stack.Item fill>
                                                <h3>
                                                    <TextStyle variation="strong">
                                                        {item.title}
                                                    </TextStyle>
                                                </h3>
                                            </Stack.Item>
                                            <Stack.Item>
                                                <p>${price}</p>
                                            </Stack.Item>
                                        </Stack>
                                    </ResourceList.Item>
                                );
                            }}
                        />
                    </Card>
                    <ApplyRandomPrices selectedItems={selectedNodes} onUpdate={(v)=>{
                        return refetch(v).then((data)=>{
                            console.log("Returned by refetch: ", data);
                            setSelectedItems(data.data.nodes);
                            return data;
                        })
                    }} />
                    </>
                );
            }}
        </Query>
    );
}

export default ResourceListWithProducts;