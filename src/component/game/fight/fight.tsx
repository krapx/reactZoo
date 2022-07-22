import "./fight.css"
import {useEffect, useRef, useState} from "react";
import {Avatar} from "@mui/material";
import {getRandZooAnimal} from "../../../api/zoo-animal.api";
import {ZooAnimalModel} from "../../../model/zoo-animal.model";
import {Loader} from "../../shared/loader/loader";
import {PlayerAnimalResponse} from "../../../api/player-animal/player-animal.dto";
import {AnimalResponse, UpdateAnimalRequest} from "../../../api/animal/animal.dto";
import {updateAnimal} from "../../../api/animal/animal.api";

export interface AnimalFighter {
    name: string
    img: string
    currentHP: number
    maxHP: number
}

interface FightProps {
    userAnimals: PlayerAnimalResponse[]
    spaceAnimals: AnimalResponse[]
}

const Fight = (props: FightProps) => {
    const {userAnimals, spaceAnimals} = props;

    if (spaceAnimals.length === 0) return <></>
    return <FightActive
        spaceAnimals={spaceAnimals}
        userAnimals={userAnimals}
    />
}

const FightActive = (props: FightProps) => {
    const {userAnimals, spaceAnimals} = props;
    const [indexCurrentAnimal, setIndexCurrentAnimal] = useState(0);
    const damageDealtContainer = useRef<HTMLDivElement>(null);
    const [animal, setAnimal] = useState<AnimalFighter>(null);

    useEffect(() => {
        setAnimal({
            name: spaceAnimals[indexCurrentAnimal].name,
            img: spaceAnimals[indexCurrentAnimal].imageLink,
            maxHP: spaceAnimals[indexCurrentAnimal].weightMax * spaceAnimals[indexCurrentAnimal].lengthMax,
            currentHP: spaceAnimals[indexCurrentAnimal].weightMax * spaceAnimals[indexCurrentAnimal].lengthMax
        })
        // handleGetAnimal()
    }, [spaceAnimals, indexCurrentAnimal]);

    useEffect(() => {
        if (animal?.currentHP < 1) {
            handleDeath()
            if (indexCurrentAnimal === spaceAnimals.length - 1) {
                setIndexCurrentAnimal(0)
            } else {
                setIndexCurrentAnimal(prevState => (prevState + 1))
            }
            return;
        }
    }, [animal])

    const handleGetAnimal = () => {
        getRandZooAnimal().then(res => {
            const animal: ZooAnimalModel = res.data
            setAnimal({
                name: animal.name,
                img: animal.image_link,
                currentHP: Math.floor(animal.weight_max * animal.length_max),
                maxHP: Math.floor(animal.weight_max * animal.length_max)
            })
        })
    }

    const handleATK = () => {
        setAnimal(prevState => ({...animal, currentHP: prevState.currentHP - getTeamDamage()}))
        damageDealtContainer.current!.appendChild(showDamageDealt())
    }

    const handleDeath = () => {
        console.log(`${animal.name} est mort !`)
        // setAnimal(prevState => ({...animal, currentHP: prevState.maxHP}))
        clearDamageDealtContainer()

        const body: UpdateAnimalRequest = {...spaceAnimals[indexCurrentAnimal]}
        updateAnimal(body).then()
    }

    const clearDamageDealtContainer = () => {
        while (damageDealtContainer.current!.firstChild) {
            damageDealtContainer.current!.removeChild(damageDealtContainer.current!.firstChild);
        }
    }

    const showDamageDealt = () => {
        const element = document.createElement("span")
        element.classList.add("fight__dealt", "fight__atk")
        element.innerText = `-${getTeamDamage()}`
        return element
    }

    const getTeamDamage = (): number => {
        return userAnimals
            .map(value => value.damage)
            .reduce((a, b) => a + b)
    }

    if (animal == null) return <Loader visibility/>
    return (
        <div className="fight">
            <div className="fight__header">{animal.name}</div>
            <div className="fight__body" onClick={handleATK}>
                <img className="fight__img"
                     src={animal.img}
                     alt="fighter"/>
                <div className="fight__damage-dealt-container" ref={damageDealtContainer}/>
                <progress
                    className="fight__health"
                    value={animal.currentHP}
                    max={animal.maxHP}
                    aria-label={`${animal.currentHP}/${animal.maxHP}`}
                />
            </div>
            <div className="fight__footer">
                <Avatar alt="my_animal"
                        src={userAnimals[0].image}/>
                ATK :
                <span className="fight__atk">{getTeamDamage()}</span>
            </div>
        </div>
    )
}

export default Fight