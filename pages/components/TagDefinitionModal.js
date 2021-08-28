import { Button, Form, FormLayout, InlineError, Modal, TextField } from '@shopify/polaris';
import React, { useState, useEffect, useCallback } from 'react';

function TagDefinitionModal({open, tagname, discountpercentage, tagdescription, handleClose, handleSubmit, tagnameerror, discountpercentageerror, tagdescriptionerror}){
    const [newTagName, setNewTagName]=useState(tagname);
    const [newDiscountPercentage, setNewDiscountPercentage]=useState(discountpercentage);
    const [newTagDescription, setNewTagDescription]=useState(tagdescription);

    const handleChange=(a)=>{
        handleSubmit(newTagName, newDiscountPercentage, newTagDescription);
    };

    useEffect(()=>{
        setNewTagName(tagname);
        setNewDiscountPercentage(discountpercentage);
        setNewTagDescription(tagdescription);
    }, [tagname, discountpercentage, tagdescription]);
    
    return (
        <Modal 
            open={open} 
            title={tagname!=""?"Edit tag definition":"Add tag definition"} 
            onClose={
                handleClose
            }
            primaryAction={{
                content:"Save tag",
                onAction:handleChange
            }}>
            <Modal.Section>
                <Form onSubmit={handleChange}>
                    <FormLayout>
                        <TextField 
                            value={newTagName} 
                            onChange={useCallback((value)=>setNewTagName(value), [])} 
                            label="Enter Tag Name" 
                            type="text" 
                            helpText={
                                <InlineError message={tagnameerror}/>
                            }>
                        </TextField>
                        
                        <TextField 
                            value={newDiscountPercentage.toString()} 
                            onChange={useCallback((value)=>setNewDiscountPercentage(value), [])} 
                            label="Enter Discount Percentage" 
                            type="text" 
                            max={100}
                            min={0}
                            step={1} 
                            helpText={
                                <InlineError message={discountpercentageerror}/>
                            }>                            
                        </TextField>

                        <TextField 
                            value={newTagDescription} 
                            onChange={useCallback((value)=>setNewTagDescription(value), [])} 
                            label="Enter discription of the tag" 
                            type="text" 
                            helpText={
                                <InlineError message={tagdescriptionerror}/>
                            }>
                        </TextField>
                        
                    </FormLayout>
                </Form>
            </Modal.Section>
        </Modal>
    );
}

export default TagDefinitionModal;