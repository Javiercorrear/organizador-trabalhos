import axios from 'axios'
import React, { useState, useEffect} from 'react';
import { MdExitToApp} from 'react-icons/md'
import { useHistory } from "react-router-dom";

import { Main, Container, Top, Section } from './styles'

import Modal from '../Components/Modal'
// import ModalV2 from '../Components/ModalV2'
import useModal from '../Components/Modal/useModal'
import ClassWorkList from '../Components/ClassWorkList'

import constants from '../../shared/constants'
import { getAccessToken, setAccessToken } from '../../shared/tokenUtils'
//import { Link } from 'react-router-dom';

const { API_BASE_URL } = constants

const _fetchClassWorkList = ( classWorkOngoingList, classWorkDoneList, setClassWorkOngoingList, setClassWorkDoneList ) => {
        return axios.get( `${ API_BASE_URL }/classworks`, { headers: { Authorization: getAccessToken() } } )
        .then( response => {
            const classWorks = response.data
            const [ classWorkOngoingListFirstItem ] = classWorkOngoingList
            const [ fetchedOngoingListFirstItem ] = classWorks.ongoing
            const [ classWorkDoneListFisrtItem ] = classWorkDoneList
            const [ fetchedDoneListFirstItem ] = classWorks.finished
            if(classWorkOngoingListFirstItem?.id !== fetchedOngoingListFirstItem?.id ) {
                setClassWorkOngoingList( classWorks.ongoing )
            }
            if(classWorkDoneListFisrtItem?.id !== fetchedDoneListFirstItem?.id) {
                setClassWorkDoneList( classWorks.finished )
            }
        } ).catch( ( error ) => {
            console.error( error )
        } )
}

function logout(history){
    //console.log("logout function!")
    setAccessToken(null);
    localStorage.clear();
    history.replace("/");
}

export default function Home() {
    const { isShowing, toggle } = useModal()
    const [file, setFile] = useState([])
    const [classWorkOngoingList, setClassWorkOngoingList] = useState([])
    const [classWorkDoneList, setClassWorkDoneList] = useState([])

    const history = useHistory();

    const fetchClassWorkList = _fetchClassWorkList.bind(null, classWorkOngoingList, classWorkDoneList )

    useEffect( () => {
        fetchClassWorkList( setClassWorkOngoingList, setClassWorkDoneList )
    }, [classWorkOngoingList, classWorkDoneList, fetchClassWorkList] )
    fetchClassWorkList( setClassWorkOngoingList, setClassWorkDoneList )

    return (
        <Main>
            <Container>
                <header>
                    <div className='titulo'>
                        <label>Gerenciamento de trabalhos academicos</label>
                    </div>
                    <div className='usuario' onClick={e=>{logout(history)}}>
                        <label>TESTE</label>
                        <MdExitToApp size={16} /> 
                    </div>
                </header>

                <Top>
                    <div />
                </Top>

                <Section>
                    <form>
                        <div className='button'>
                            <button type='button' onClick={toggle}>
                                Upload
                            </button>
                            <Modal
                                isShowing={isShowing}
                                hide={toggle}
                                file={file}
                                setFile={setFile}
                                fetchClassWorks={() => fetchClassWorkList(setClassWorkOngoingList, setClassWorkDoneList)}
                            />
                        </div>
                    </form>

                    <ClassWorkList
                        ongoingList={classWorkOngoingList}
                        fetchClassWorks={() => fetchClassWorkList(setClassWorkOngoingList, setClassWorkDoneList)}
                    />
                </Section>
            </Container>
        </Main>
    )
}
