import React, { useState, useEffect } from 'react';
import { Heading, Page, TextStyle, Layout, EmptyState, Button, Card } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import TagDefinitionModal from './components/TagDefinitionModal'
import TagsList from './components/TagsList';

import axios from 'axios';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

const Index = () => {
    const [open, setOpen] = useState(false);
    const [tagnameerror, setTagnameerror]=useState(null);
    const [discountpercentageerror, setDiscountpercentageerror]=useState(null);
    const [tagdescriptionerror, setTagdescriptionerror]=useState(null);
    const [tagname, setTagname]=useState("");
    const [discountpercentage, setDiscountpercentage]=useState("");
    const [tagdescription, setTagdescription]=useState("");

    const [tagsList, setTagsList]=useState([]);

    const handleClose=()=>{
        setOpen(false);
    }

    const fetchTagsList=()=>{
        axios.get('/rest/')
        .then(function(response){
            setTagsList(response.data);

        }).catch(function(error){
            console.error(response);
        }).then(function(){
            // Stop loader here
        });
    }

    const deleteTag=(name)=>{
        if(!confirm("Are you sure you want to delete this tag?")){
            return;
        }
        axios.delete("/rest/", {data:{name}})
            .then(function(response){
                fetchTagsList();
            })
            .catch(function(error){
                console.error(error);
            })
            .then(function(){
                // Finally executed
            });
    }
    useEffect(() => {
        fetchTagsList();
    }, []);

    const handleTagFormSubmit=(name, discountpercentage, description)=>{
        if(!name||name==""){
            setTagnameerror("Please enter a tag name.");
        }
        if(!discountpercentage||discountpercentage==""){
            setDiscountpercentageerror("Please enter a discount percentage to provide on this tag.");
        }else if(discountpercentage<0||discountpercentage>100||discountpercentage%1!=0){
            setDiscountpercentageerror("Please enter a valid discount percentage.");
        }
        
        setTimeout(()=>{
            setTagnameerror(null);
            setDiscountpercentageerror(null);
            setTagdescriptionerror(null);
        }, 10000);

        if(tagnameerror||tagdescriptionerror||discountpercentageerror){
            return;
        }


        axios.post('/rest/', {
                name,
                discountpercentage,
                description
            })
            .then(function(response){
                fetchTagsList();
                setOpen(false);
            })
            .catch(function(error){
                console.error(error);
            })
            .then(function(){
                // Finally executed
            });
    }

    const openNewTagModal=()=>{
        setTagname("");
        setDiscountpercentage("");
        setTagdescription("");

        setOpen(true);
    }

    const openEditTagModel=(tagname, discountpercentage, tagdescription)=>{
        setTagname(tagname);
        setDiscountpercentage(discountpercentage);
        setTagdescription(tagdescription);
        setOpen(true);
    }

    return (<Page>
        <TitleBar
            primaryAction={{
                content: 'Add tag definition',
                onAction: () => openNewTagModal(),
            }}
        />
        <TagsList tags={tagsList}
            openEditModal={openEditTagModel} 
            deleteTag={deleteTag}
        />
        
        <TagDefinitionModal 
            open={open} 
            tagname={tagname} 
            discountpercentage={discountpercentage} 
            tagdescription={tagdescription} 

            tagnameerror={tagnameerror}    
            discountpercentageerror={discountpercentageerror} 
            tagdescriptionerror={tagdescriptionerror}

            handleSubmit={handleTagFormSubmit} 
            handleClose={handleClose}>
        </TagDefinitionModal>        
    </Page>);
}

export default Index;