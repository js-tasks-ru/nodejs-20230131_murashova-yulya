const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 15,
        },
      });

      it(' - нижняя граница', () => {
        const errors = validator.validate({ name: 'Lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });
      
      it(' - верхняя граница', () => {
        const errors = validator.validate({ name: 'Lalala lalala lalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 15, got 20');
      });
    });
    
    describe('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 12,
          max: 18,
        },
      });

        it(' - нижняя граница', () => {

        const errors = validator.validate({ age: 9 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 12, got 9');
      });
      
        it(' - верхняя граница', () => {

        const errors = validator.validate({ age: 29 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 18, got 29');
      });
      
    });
    
    describe('валидатор проверяет типы', () => {
      
     const validator = new Validator({
        age: { //надо было проверять соответствие age - number, name - string? Или в принципе не важно, как поля называются?
          type: 'string',
          min: 12,
          max: 18,
        },
      });

        [
            {age: {}},
            {age: null},
            {age: true},
            {age: 9n},
            {age: NaN},
            {age: undefined},
        ].forEach((obj) => {
            it(' - возвращает ошибку, если тип не соответствует заявленному (' + typeof obj.age + ')', () => {
                const errors = validator.validate(obj);
                expect(errors).to.have.length(1);
            });
        });
        
        const validatorM = new Validator({
            name: {
              type: 'string',
              min: 1,
              max: 50,
            },            
            lastName: {
              type: 'string',
              min: 1,
              max: 50,
            },
            age: {
              type: 'number',
              min: 1,
              max: 150,
            },
          });
        
        it(' - должен проверить тип каждого поля', () => {
            const errors = validatorM.validate({ name:1, lastName: 2, age: '29' });
            expect(errors).to.have.length(3);
        });
    });    
  });
});