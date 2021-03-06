// https://github.com/CategoricalData/easik/blob/master/sketches/sample.easik
var sampleXMLMovies = 
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
    '<easketch>' +
    '  <header>' +
    '    <title>Movies</title>' +
    '    <author>Rosebrugh</author>' +
    '    <author>Green</author>' +
    '    <author>Ranieri</author>' +
    '    <description>Samples movie data base</description>' +
    '    <creationDate>2006-08-17T16:01:33</creationDate>' +
    '    <lastModificationDate>2009-05-27T13:37:45</lastModificationDate>' +
    '  </header>' +
    '  <entities>' +
    '    <entity name="crews" x="268" y="176"/>' +
    '    <entity name="playsin" x="240" y="34"/>' +
    '    <entity name="crew" x="172" y="91">' +
    '      <attribute attributeTypeClass="easik.database.types.Varchar" name="training" size="255"/>' +
    '    </entity>' +
    '    <entity name="title" x="376" y="213">' +
    '      <attribute attributeTypeClass="easik.database.types.Varchar" name="movie_name" size="255"/>' +
    '    </entity>' +
    '    <entity name="comedy" x="380" y="463"/>' +
    '    <entity name="person" x="23" y="99">' +
    '      <attribute attributeTypeClass="easik.database.types.Varchar" name="name" size="255"/>' +
    '      <attribute attributeTypeClass="easik.database.types.Int" name="age"/>' +
    '    </entity>' +
    '    <entity name="directs" x="173" y="250"/>' +
    '    <entity name="director" x="32" y="234"/>' +
    '    <entity name="comedy-dir" x="155" y="470"/>' +
    '    <entity name="drama" x="483" y="356"/>' +
    '    <entity name="actor" x="48" y="22"/>' +
    '  </entities>' +
    '  <edges>' +
    '    <edge cascade="cascade" id="f12" source="comedy" target="title" type="normal"/>' +
    '    <edge cascade="cascade" id="f2" source="playsin" target="title" type="normal"/>' +
    '    <edge cascade="cascade" id="isA_3" source="comedy-dir" target="director" type="injective"/>' +
    '    <edge cascade="cascade" id="f4" source="director" target="person" type="injective"/>' +
    '    <edge cascade="cascade" id="f11" source="comedy-dir" target="comedy" type="normal"/>' +
    '    <edge cascade="cascade" id="f9" source="crews" target="title" type="normal"/>' +
    '    <edge cascade="cascade" id="f3" source="directs" target="director" type="normal"/>' +
    '    <edge cascade="cascade" id="f5" source="actor" target="person" type="injective"/>' +
    '    <edge cascade="cascade" id="f10" source="comedy-dir" target="directs" type="normal"/>' +
    '    <edge cascade="cascade" id="f8" source="crews" target="crew" type="normal"/>' +
    '    <edge cascade="cascade" id="f1" source="playsin" target="actor" type="normal"/>' +
    '    <edge cascade="cascade" id="f6" source="directs" target="title" type="normal"/>' +
    '    <edge cascade="cascade" id="isA_1" source="drama" target="title" type="injective"/>' +
    '    <edge cascade="cascade" id="f7" source="crew" target="person" type="injective"/>' +
    '  </edges>' +
    '  <keys/>' +
    '  <constraints>' +
    '    <sumconstraint isVisible="true" x="162" y="202">' +
    '      <path codomain="person" domain="director">' +
    '        <edgeref id="f4"/>' +
    '      </path>' +
    '      <path codomain="person" domain="actor">' +
    '        <edgeref id="f5"/>' +
    '      </path>' +
    '      <path codomain="person" domain="crew">' +
    '        <edgeref id="f7"/>' +
    '      </path>' +
    '    </sumconstraint>' +
    '    <pullbackconstraint isVisible="true" x="268" y="354">' +
    '      <path codomain="directs" domain="comedy-dir">' +
    '        <edgeref id="f10"/>' +
    '      </path>' +
    '      <path codomain="title" domain="directs">' +
    '        <edgeref id="f6"/>' +
    '      </path>' +
    '      <path codomain="comedy" domain="comedy-dir">' +
    '        <edgeref id="f11"/>' +
    '      </path>' +
    '      <path codomain="title" domain="comedy">' +
    '        <edgeref id="f12"/>' +
    '      </path>' +
    '    </pullbackconstraint>' +
    '    <commutativediagram isVisible="true" x="135" y="301">' +
    '      <path codomain="director" domain="comedy-dir">' +
    '        <edgeref id="f10"/>' +
    '        <edgeref id="f3"/>' +
    '      </path>' +
    '      <path codomain="director" domain="comedy-dir">' +
    '        <edgeref id="isA_3"/>' +
    '      </path>' +
    '    </commutativediagram>' +
    '  </constraints>' +
    '</easketch>';
