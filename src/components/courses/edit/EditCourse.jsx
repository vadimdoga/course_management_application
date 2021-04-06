import React, { Component } from 'react'
import { Button, Form, Input, Segment, Select, TextArea } from 'semantic-ui-react'
import { Accordion, Icon, Popup } from 'semantic-ui-react'

import HeaderComponent from "../../header/HeaderComponent"
import ExpandDetails from "../../course_components/ExpandDetails"
import LessonDetails from "./LessonDetails"

const gradeOptions = [
    { key: 'grade_1', text: 'Grade I', value: 'grade_1' },
    { key: 'grade_2', text: 'Grade II', value: 'grade_2' },
    { key: 'grade_3', text: 'Grade III', value: 'grade_3' },
    { key: 'grade_4', text: 'Grade IV', value: 'grade_4' },
]

const segment_style = {
    borderRadius: "25px",
    margin: "auto",
    width: "50%",
    marginBottom: "2rem",
    textAlign: "left"
}

const accordion_style = {
    marginTop: "1rem",
    textAlign: "left"
}

const btn_style = {
    marginTop: "0.5rem"
}

const btn_right_style = {
    marginTop: "0.5rem",
    marginRight: "1rem"
}

export default class EditCourse extends Component {
    constructor(props) {
        super(props)

        this.handleSubmitExit = this.handleSubmitExit.bind(this)
        this.handleAddExpandable = this.handleAddExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.createExpandable = this.createExpandable.bind(this)

        this.state = {
            courseName: "",
            courseDescription: "",
            gradeOption: "",
            children: [],
            lessonName: "",
            components: {
                length: 0,
                children: {}
            }
        }

    }

    componentDidMount() {
        const id = this.props.match.params.id;
        console.log(id)

        let length = this.state.components.length + 1
        let new_key = "key_" + length
        let children = this.state.components["children"]

        children[new_key] = <ExpandDetails key="maths_grade_1" title="Maths grade 1"><LessonDetails /></ExpandDetails>

        length = length + 1
        new_key = "key_" + length
        children[new_key] = <ExpandDetails key="maths_grade_2" title="Maths grade 2"><LessonDetails /></ExpandDetails>

        const total_length = getCount(children) + this.state.components.length

        this.setState({
            courseName: "Lorem Ipsum",
            courseDescription: "Lorem Ipsum",
            gradeOption: "grade_3",
            components: {
                children: children,
                length: total_length,
                new_length: getCount(this.state.components.children)
            }
        })
    }

    handleSubmitExit(e) {
        e.preventDefault()

        this.props.history.push("/courses");
    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const children = this.state.components["children"]
            delete children[key]

            this.setState({
                components: {
                    children: children,
                    length: this.state.components.length - 1
                }
            })
        }
    }

    handleMoveUp(e) {
        const element = document.querySelector("#" + e.currentTarget.value)

        if (element !== undefined)
            if (element.previousElementSibling)
                element.parentNode.insertBefore(element, element.previousElementSibling);
    }

    handleMoveDown(e) {
        const element = document.querySelector("#" + e.currentTarget.value)

        if (element !== undefined)
            if (element.nextElementSibling)
                element.parentNode.insertBefore(element.nextElementSibling, element);
    }

    handleAddExpandable(e) {
        const length = this.state.components.length + 1
        const new_key = "key_" + length

        let children = this.state.components["children"]
        children[new_key] = <ExpandDetails key="grade_3_maths" title={this.state.lessonName}>Lesson details will be here</ExpandDetails>

        this.setState({
            components: {
                length: length,
                children: children
            },
            lessonName: ""
        })
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + key
        console.log(id)
        return <div key={id} id={id}>
            <Button style={btn_right_style} onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveDown} value={id} floated="right" color="blue" icon="arrow circle down" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveUp} value={id} floated="right" color="blue" icon="arrow circle up" size="mini" />
            {value}
        </div>
    }

    render() {
        return (
            <div>
                <HeaderComponent history={this.props.history} />

                <Segment style={segment_style} color="teal" size="small">
                    <Form>
                        <Form.Group>
                            <Form.Field
                                id="form-input-control-course-name"
                                control={Input}
                                label='Course name'
                                placeholder='Mathematics'
                                width={12}
                                value={this.state.courseName}
                                onChange={e => this.setState({ courseName: e.target.value })}
                            />
                            <Form.Field
                                control={Select}
                                options={gradeOptions}
                                label={{ children: 'Grades', htmlFor: 'form-select-control-grades' }}
                                placeholder='Grades'
                                search
                                searchInput={{ id: 'form-select-control-grades' }}
                                value={this.state.gradeOption}
                                onChange={e => this.setState({ gradeOption: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Field
                            id='form-textarea-control-course-description'
                            control={TextArea}
                            label='Description'
                            placeholder='Course description'
                            value={this.state.courseDescription}
                            onChange={e => this.setState({ courseDescription: e.target.value })}
                        />
                        <Form.Group>
                            <Form.Button onClick={this.handleSubmitExit} content='Save changes & exit' />
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment style={segment_style} color="blue" size="small">
                    <span style={{ fontWeight: "bold", margin: "1rem" }}>New Lesson</span>
                    <Popup
                        trigger={<Button circular size="small" color="teal" icon='plus circle' />}
                        content={
                            <div>
                                <Input onChange={e => this.setState({ lessonName: e.target.value })} value={this.state.lessonName} style={{ marginBottom: "1rem" }} placeholder='Lesson Name' />
                                <Button onClick={this.handleAddExpandable} color='green' content='Create Lesson' />
                            </div>}
                        on='click'
                    />

                    <Accordion style={accordion_style} fluid styled>
                        {
                            Object.entries(this.state.components["children"]).map(this.createExpandable)
                        }
                    </Accordion>
                </Segment>
            </div>
        )
    }
}


function getCount(obj) {
    var count = 0,
        prop;

    for (prop in obj) {
        if (obj.hasOwnProperty(prop) && prop !== "average_age" && prop !== "count") {
            count += 1;
        }
    }
    return count;
}
