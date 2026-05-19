import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Otp } from './otp';
import { EventEmitter } from '@angular/core';

describe('Otp', () => {
  let component: Otp;
  let fixture: ComponentFixture<Otp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otp],
    }).compileComponents();

    fixture = TestBed.createComponent(Otp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only accept numeric input', () => {
    const event = new Event('input');
    const input = {
      value: 'a',
      target: { value: 'a' },
    } as any;
    component.onInput(input, 0);
    expect(component.otpValues()[0]).toBe('');
  });

  it('should allow only single digit per field', () => {
    const event = new Event('input');
    const input = {
      value: '12',
      target: { value: '12' },
    } as any;
    component.onInput(input, 0);
    expect(component.otpValues()[0]).toBe('2');
  });

  it('should mark as invalid when non-numeric input is detected', () => {
    const input = {
      value: 'a',
      target: { value: 'a' },
    } as any;
    component.onInput(input, 0);
    expect(component.isInvalid()).toBe(true);
  });

  it('should emit otpComplete when all 6 digits are filled', () => {
    spyOn(component.otpComplete, 'emit');
    const values = ['1', '2', '3', '4', '5', '6'];
    values.forEach((v, i) => {
      const input = {
        value: v,
        target: { value: v },
      } as any;
      component.onInput(input, i);
    });
    expect(component.otpComplete.emit).toHaveBeenCalledWith('123456');
  });

  it('should reset OTP values and state', () => {
    component.otpValues.set(['1', '2', '3', '4', '5', '6']);
    component.isInvalid.set(true);
    component.reset();
    expect(component.otpValues()).toEqual(['', '', '', '', '', '']);
    expect(component.isInvalid()).toBe(false);
  });

  it('should handle paste event with numeric data', () => {
    const clipboardData = {
      getData: () => '123456',
    } as any;
    const pasteEvent = {
      preventDefault: () => {
        /* empty */
      },
      clipboardData: clipboardData,
    } as any;
    component.onPaste(pasteEvent);
    expect(component.otpValues().join('').startsWith('123456')).toBe(true);
  });

  it('should handle backspace to go to previous field', () => {
    component.otpValues.set(['1', '', '', '', '', '']);
    const keyEvent = {
      key: 'Backspace',
      preventDefault: () => {
        /* empty */
      },
      target: { value: '' },
    } as any;
    component.onKeyDown(keyEvent, 1);
    expect(component.otpValues()[0]).toBe('');
  });
});
