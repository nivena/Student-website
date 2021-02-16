import React from "react";
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { FontSizes } from '@fluentui/theme';
import { Dropdown, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon, IIconStyles } from 'office-ui-fabric-react/lib/Icon';
import { useHistory } from "react-router-dom";
import { getTheme } from '@fluentui/react';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react/lib/Tooltip';
import { useId } from '@uifabric/react-hooks';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { Toggle } from '@fluentui/react';

const theme = getTheme();

const onRenderCaretDown = (): JSX.Element => {
    return <Icon iconName="List" />;
};

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {  border: 'none', borderStyle: 'none', height: '44px', backgroundColor: theme.palette.white, alignItems: 'center', fontSize: FontSizes.size16 },
    dropdownItems: { textAlign: 'center', alignItems: 'center' },
    caretDown: { fontSize: '15px'},
    caretDownWrapper: { right: '25px', top: '10px' }
};

export enum ItemsKeys {
    home = "home",
    rules = "rules",
    courses = "courses",
    services = "services",
    additional_groups = "additional_groups",
    administrators = "administrators",
    representatives = "representatives"
}

const texts: Map<ItemsKeys, string> = new Map<ItemsKeys, string>([
    [ItemsKeys.home, "Home"],
    [ItemsKeys.rules, "Regolamento"],
    [ItemsKeys.courses, "Corsi"],
    [ItemsKeys.services, "Servizi"],
    [ItemsKeys.additional_groups, "Gruppi extra"],
    [ItemsKeys.administrators, "Amministratori"],
    [ItemsKeys.representatives, "Rappresentanti"]
]);


const languageOptions: IDropdownOption[] = [
    { key: 'ITA', text: 'Italiano', data: { icon: 'Memo' } },
    { key: 'ENG', text: 'Inglese', data: { icon: 'Print' } },
];

interface Props { 
    setTheme: (arg: boolean) => void, 
    theme?: boolean 
};

initializeIcons();

const HeaderMenu = (props: Props) => {
    const history = useHistory();

    const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
    
    const getPath = React.useCallback((): Array<string|boolean> => {
        var states = history.location.pathname.substring(1).split('/').filter(x => x !== '');
        let first = states.length > 0 ? states[0] : '';
        let isCorrectPathKey = Object.keys(ItemsKeys).filter(x => x === first).length !== 0;
        return [first, isCorrectPathKey];
    }, [history.location.pathname]);

    let didMount = React.useRef(false);

    React.useEffect(() => {
        if(!didMount.current) {
            didMount.current = true
            let [path, isCorrect] = getPath()
            if(!isCorrect) {
                history.push('/home/')
                setSelectedKey(ItemsKeys.home)
            } else {
                setSelectedKey(path as ItemsKeys)
            }
        }
    }, [getPath, history])
    
    let [path, isCorrect] = getPath()

    const [selectedKey, setSelectedKey] = React.useState(isCorrect ? path as ItemsKeys : ItemsKeys.home);

    const handlePivotLinkClick = (item?: PivotItem, e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setSelectedKey(item!.props.itemKey! as ItemsKeys);
        history.push(`/${item!.props.itemKey!}/`)
    };

    const onDropdownValueChange = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        setSelectedKey(item!.key! as ItemsKeys);
        history.push(`/${item!.key! as string}/`)
    };

    const dropdownOptions: IDropdownOption[] = Object.values(ItemsKeys).map(x => ({ key: x, text: texts.get(x)! }));

    // Panel and components settings
    const tooltipId = useId('tooltip');
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const settingsIcon: IIconProps = { iconName: 'Settings', styles: { root: { fontSize: '18px' } } };
    const settingsIconStylePivot: IIconStyles = { root: { position: 'absolute', right: '3px', top: '94px', zIndex: 10 } };
    const settingsIconStyleDropdown: IIconStyles = { root: { position: 'absolute', left: '3px', top: '10px', zIndex: 10 } };
    const settingsIconId = useId('icon');
    const calloutProps = { gapSpace: 0, target: `#${settingsIconId}`, };

    return (
        <div className="header-menu" style={{  boxShadow: '0px 0.5px 0.5px #b3b5b4' }}>

            <div className="pivot">
                <Pivot
                    selectedKey={selectedKey}
                    onLinkClick={handlePivotLinkClick}
                    headersOnly={true}
                    style={{ fontSize: FontSizes.size24 }}
                >
                    {Object.values(ItemsKeys).map((x,i) =><PivotItem key={i} headerText={texts.get(x)} style={{ fontSize: FontSizes.size24 }} itemKey={x}/>)}
                </Pivot>

                <TooltipHost content="Impostazioni del sito" id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                    <IconButton iconProps={settingsIcon} onClick={openPanel} styles={settingsIconStylePivot} id={settingsIconId}/>
                </TooltipHost>

                <Panel
                    isLightDismiss
                    isOpen={isOpen}
                    onDismiss={dismissPanel}
                    closeButtonAriaLabel="Close"
                    headerText="Impostazioni"
                    type={PanelType.smallFixedFar}
                >
                    <Toggle
                        label="Cambia il tema"
                        onText="Dark Mode attiva"
                        offText="Dark Mode disattivata"
                        checked={props.theme}
                        onChange={() => props.setTheme(!props.theme)}
                    />
                    <Dropdown
                        label="Seleziona la lingua"
                        defaultSelectedKey="ITA"
                        options={languageOptions}
                        disabled={true}
                    />
                </Panel>
            </div>

            <div className="dropdown">

                <TooltipHost content="Impostazioni del sito" id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                    <IconButton iconProps={settingsIcon} onClick={openPanel} styles={settingsIconStyleDropdown} id={settingsIconId}/>
                </TooltipHost>

                <Dropdown
                    selectedKey={selectedKey}
                    onChange={onDropdownValueChange}
                    options={dropdownOptions}
                    styles={dropdownStyles}
                    onRenderCaretDown={onRenderCaretDown}
                />


            </div>
        </div>
    );
};

export default HeaderMenu;